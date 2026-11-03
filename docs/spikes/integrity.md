# Spike B — App integrity and device signals (Phase 0) — DESK RESEARCH DONE, DEVICE TESTS PENDING

Date: 2026-11-03. Method: official documentation and public sources (listed at the end). **Nothing was run on a phone yet** — every "works" below means "documented", not "tested by us".

## 1. Summary

| Need | Finding | Effect on the plan |
|---|---|---|
| Play Integrity + App Attest from Expo | **`@expo/app-integrity`** — official Expo library, wraps Play Integrity (standard request) on Android and App Attest on iOS. Introduced in SDK 54 (Sept 2025) as **alpha**; reference pages exist up to SDK 58. | Use it instead of writing our own native module (new **D-033**, PROPOSED). Pin the version and wrap it behind our own `src/device/integrity.ts` so it can be replaced if the alpha API breaks. |
| Mock location per fix | `expo-location` `LocationObject.mocked` — documented for **Android and iOS** (iOS: true for software-simulated locations). | The earlier "iOS UNKNOWN → custom module" note is resolved: no custom module needed for this signal. Still client-reported (WEAK). |
| Approximate vs precise | `LocationPermissionResponse.android.accuracy` = `'fine' \| 'coarse' \| 'none'`; `ios.accuracy` = `'full' \| 'reduced'` (iOS 14+) | Location Permission screen can detect "approximate only" directly. |
| Cached location | `getLastKnownPositionAsync({ maxAge, requiredAccuracy })` exists | Never used for punching; good for a fast first estimate on the dashboard only. |
| Enable GPS prompt | `enableNetworkProviderAsync()` — Android only | Matches `04` §4. |
| Developer Options / USB debugging | `Settings.Global.DEVELOPMENT_SETTINGS_ENABLED`, `Settings.Global.ADB_ENABLED` are public constants; no Expo API found | Needs a **small custom Expo Module** (or a third-party library, see below). |
| Wireless debugging | `adb_wifi_enabled` is an **undocumented** global key; reading it from an app is not officially supported; one unverified source suggests `service.adb.tcp.port` on Android ≤ 10 | Best-effort only; send `null` when unreadable. Must be tested per Android version. |
| Root / jailbreak heuristics | `jail-monkey` (maintained fork GantMan/jail-monkey; New Architecture support from v3.0.0-0): `isJailBroken()`, `canMockLocation()`, `trustFall()`. No confirmed Expo config plugin; emulators often report as rooted. | Optional, WEAK signals only; needs a dev build; evaluate on devices before adopting. |
| Server: Play Integrity decode | Google API `playintegrity v1` `decodeIntegrityToken(packageName, { integrityToken })` → `tokenPayloadExternal`. Node: `googleapis` client or `google-auth-library` + REST (exact Node usage **not verified**). | Root dependency needed in `fashion-erp` (approval, D-031). |
| Server: App Attest verification | Node libraries exist: `node-app-attest` (`verifyAttestation`, `verifyAssertion`), `appattest-checker-node`, `@bradford-tech/supabase-integrity-attest` (WebCrypto only). Maintenance and licences **not checked**. A forum thread shows hand-rolled assertion checks with `crypto.createVerify` going wrong. | Prefer a reviewed library over hand-rolled CBOR/signature code; review licence + maintenance in Phase 4 before adding. |

## 2. Play Integrity — what the verdict can tell us

From Google's verdict documentation:

- **`requestDetails`** (standard request): `requestPackageName`, `requestHash`, `timestampMillis`. Server must check package, that `requestHash` equals what we expect (we use SHA-256 of challenge‖clientPunchId‖type), and freshness — **before** reading any other verdict.
- **`appIntegrity.appRecognitionVerdict`**: `PLAY_RECOGNIZED` (app + certificate match Play's records) · `UNRECOGNIZED_VERSION` (certificate or package name doesn't match — modified/repackaged) · `UNEVALUATED`.
- **`deviceIntegrity.deviceRecognitionVerdict`** (default): `MEETS_DEVICE_INTEGRITY` = genuine certified device; on Android 13+ with hardware-backed proof of a locked bootloader and certified OS image. **Empty** = signs of attack (API hooking), system compromise (rooted), or not a physical device (emulator).
  - Optional opt-in labels: `MEETS_BASIC_INTEGRITY` (basic checks, bootloader may be unlocked), `MEETS_STRONG_INTEGRITY` (on Android 13+: device integrity **plus** security updates in the last year for all partitions). **On Android 13+ these optional labels are only returned when the app is licensed (installed/updated through Google Play).**
  - Optional: `deviceAttributes.sdkVersion`; `recentDeviceActivity` (LEVEL_1 ≤ 10 standard requests/hour/app … LEVEL_4 > 50); **device recall (beta)** — 3 bits per device that survive reinstall (similar to Apple DeviceCheck).
- **`accountDetails.appLicensingVerdict`**: `LICENSED` / `UNLICENSED` (e.g. sideloaded) / `UNEVALUATED`.
- **`environmentDetails`** (opt-in): `appAccessRiskVerdict.appsDetected` (`KNOWN_/UNKNOWN_` + `INSTALLED`, `CAPTURING`, `CONTROLLING`, `OVERLAYS`) and `playProtectVerdict` (`NO_ISSUES`, `NO_DATA`, `POSSIBLE_RISK` = Play Protect off, `MEDIUM_RISK`, `HIGH_RISK`, `UNEVALUATED`).

**Quota:** default **10,000 requests per day** per app, shared between classic requests and standard token preparations; server-side decryptions also capped at 10,000/day. Increases by form; the app must be on Google Play, Cloud project linked in Play Console, proper retry logic; processing can take up to a week. Estimate for us: ~2–3 calls per employee per working day → the default covers roughly 3,000–5,000 active employees; above that, request an increase before rollout.

**What it does NOT tell us:** whether the GPS position is real. A genuine, unrooted phone with a fake-GPS app installed from Play still passes device integrity; `appAccessRiskVerdict` and `playProtectVerdict` may add context but are not fake-GPS detectors.

### Mapping to our risk reasons (`08` §6) — proposed changes

| Verdict | Reason | Strength |
|---|---|---|
| `requestHash`/package mismatch, stale `timestampMillis` | `INTEGRITY_INVALID_SIGNATURE` (rename to `INTEGRITY_INVALID`) | CRITICAL |
| `UNRECOGNIZED_VERSION` on a production build | `APP_NOT_RECOGNIZED` | STRONG |
| `deviceRecognitionVerdict` lacks `MEETS_DEVICE_INTEGRITY` | `DEVICE_INTEGRITY_FAILED` | STRONG |
| `appLicensingVerdict = UNLICENSED` | `APP_NOT_FROM_PLAY` (new) | WEAK (company may distribute privately — Q-08) |
| `appsDetected` contains `UNKNOWN_CONTROLLING` | `CONTROL_APP_ACTIVE` (new, optional) | WEAK |
| `playProtectVerdict` `HIGH_RISK` | `PLAY_PROTECT_HIGH_RISK` (new, optional) | WEAK |
| token unavailable (no Play services, quota, network) | `INTEGRITY_UNAVAILABLE` | WEAK |

## 3. App Attest — what we learned

- Availability: `isSupported` must be checked; **not supported on the iOS Simulator**; only watchOS 9+ extensions support it (not relevant to us).
- Keys **do not survive reinstall, device migration or restore from backup** → a reinstall must re-register the device (already in our design: reinstall = new installation id).
- Do not share one key across users on a device → one key per (installation, user); our `mobile_devices` is `@@unique([userId, installationId])`, so a second user on the same phone gets a new key. ✔
- Server challenge must be one-time and at least 16 bytes. Our HMAC challenge payload is larger; the bytes hashed into `clientDataHash` must be exactly the challenge string we issued. ✔
- **Rate limit:** Apple's guidance is to keep `attestKey` calls under about **100 requests per second across all installs**; the threshold may fluctuate; no documented exemption. → stagger first launches (staged rollout), retry with backoff on `ERR_APP_INTEGRITY_SERVER_UNAVAILABLE` using the same key. For our scale this is unlikely to matter, but the retry rule goes into Phase 4.
- `@expo/app-integrity` iOS API: `isSupported`, `generateKeyAsync()`, `attestKeyAsync(keyId, challenge)`, `generateAssertionAsync(keyId, challenge)`. Store `keyId` persistently (SecureStore), not the attestation object.
- Error handling (from Expo docs): `ERR_APP_INTEGRITY_PROVIDER_INVALID` → call `prepareIntegrityTokenProviderAsync` again; `ERR_APP_INTEGRITY_SERVER_UNAVAILABLE` → retry later with the same key; other attestation errors → discard key, create a new one.
- Setup: App Attest capability in Xcode / entitlements; App ID registered in the Apple Developer account. In Expo we will need the entitlement in `app.config.ts` (via `ios.entitlements`) — **to verify in Phase 2**, since the Expo page describes the Xcode step.

## 4. Android Play Integrity via `@expo/app-integrity`

`prepareIntegrityTokenProviderAsync(cloudProjectNumber)` once (app start / background), then `requestIntegrityCheckAsync(requestHash)` per punch. Standard flow needs Android 5.0+ (API 21). Hardware attestation helpers also exist (`generateHardwareAttestedKeyAsync`, …) — not planned.

## 5. Decisions this suggests (all PROPOSED)

- **D-033:** Use `@expo/app-integrity` for Play Integrity + App Attest; pin the version; isolate behind `src/device/integrity.ts`; fallback plan = small custom Expo Module if the alpha API becomes unusable.
- **D-034:** Use `expo-location`'s `mocked` on both platforms (no custom module for mock location).
- **D-035:** Developer Options / USB debugging / wireless debugging via one small custom Expo Module (`modules/device-signals`), returning `null` when not readable; `jail-monkey` only if device tests show it is reliable and maintained.
- Risk table additions in §2 (new reasons `APP_NOT_FROM_PLAY`, optional `CONTROL_APP_ACTIVE`, `PLAY_PROTECT_HIGH_RISK`) — to be merged into `08` §6 when approved.

## 6. Still to do (needs devices / accounts)

| Test | Needs |
|---|---|
| `@expo/app-integrity` on a real Android build from Play internal testing → server decode → verdict | Play Console account, Cloud project, service account, test device |
| Same on a sideloaded/debug build (expect `UNRECOGNIZED_VERSION`) and an emulator (expect empty device verdict) | as above |
| App Attest register + assertion on a TestFlight build, verified by a Node library | Apple Developer account, physical iPhone |
| `mocked` with a Play-store fake-GPS app (Android) and Xcode simulated location (iOS) | test phones |
| `DEVELOPMENT_SETTINGS_ENABLED`, `ADB_ENABLED`, `adb_wifi_enabled` readability on Android 10, 12, 14, 15+ (Samsung, Xiaomi, Pixel) | test phones, throwaway dev build |
| `jail-monkey` false positives on normal phones | test phones |

## Sources

- Expo `@expo/app-integrity` reference: https://docs.expo.dev/versions/latest/sdk/app-integrity/ (also v57/v58 pages)
- Expo blog "Expo App Integrity" (Sept 2025, SDK 54, alpha): https://expo.dev/blog/expo-app-integrity.md
- Expo Location reference: https://docs.expo.dev/versions/latest/sdk/location/
- Play Integrity verdicts: https://developer.android.com/google/play/integrity/verdicts
- Play Integrity setup / quota: https://developer.android.com/google/play/integrity/setup and quota form https://support.google.com/googleplay/android-developer/contact/piaqr
- Play Integrity API (decodeIntegrityToken) reference: https://googleapis.github.io/google-api-python-client/docs/dyn/playintegrity_v1.v1.html
- Apple — preparing to use App Attest (rate guidance): https://developer.apple.com/documentation/devicecheck/preparing-to-use-the-app-attest-service ; forum on large rollouts: https://developer.apple.com/forums/thread/834807
- App Attest Node libraries: https://npmjs.com/package/node-app-attest , https://github.com/topics/apple-appattest , https://jsr.io/@bradford-tech/supabase-integrity-attest ; assertion pitfall thread: https://developer.apple.com/forums/thread/662477
- jail-monkey (maintained fork): https://github.com/GantMan/jail-monkey
- Wireless debugging key (unofficial): https://www.volcengine.com/article/2516729 , https://github.com/project-SIMPLE/adb-auto-enable
