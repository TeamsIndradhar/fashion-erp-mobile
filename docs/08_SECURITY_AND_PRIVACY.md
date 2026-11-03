# 08 — Security, Anti-Fake Attendance and Privacy (PROPOSED)

Platform facts below come from public Android/Apple/Google/Expo documentation; desk research for Spike B is recorded in `docs/spikes/integrity.md` (2026-11-03). Anything not yet tested on a real device is marked **verify**.

## 1. Assets

Passwords; access/refresh tokens; selfies and enrolled face photos; punch location; attendance records (they drive salary via `salary-calculator.ts` — fraud has a money impact).

## 2. Threat model

| Threat | Example | Controls |
|---|---|---|
| Credential stuffing | scripted logins | existing per-email lockout (shared with web) + new per-IP limit; generic error |
| Token theft on phone | malware, backup extraction | SecureStore (Keystore/Keychain, this-device-only), 15-min access token, revocation |
| Token theft in transit | rogue Wi-Fi | HTTPS + HSTS; cert pinning not in v1 (D-017) |
| Stolen token used on other ERP APIs | phone token replayed against `/api/v1/*` | bearer **allowlist** (only mobile routes) |
| Refresh replay | stolen refresh token | rotation + reuse detection |
| Fake GPS app | Android mock provider | mocked flag (weak, client) + Play Integrity + server signals + review |
| Modified app / hooking (Frida, repackaged APK) | send any coordinates, fake "mocked=false" | Play Integrity `appIntegrity` / App Attest — server-verified |
| Emulator / rooted / jailbroken | spoofing tools easier | Play Integrity device verdict (server-verified); heuristics only as weak signals |
| Request replay | captured punch re-sent | single-use HMAC challenge, idempotency, integrity token bound to challenge |
| Buddy punching | colleague's phone/face | selfie on every punch, face (Q-01), "device used by another employee" signal, manager selfie review |
| Client lies about face match | send own `facePhotoId` | SW-1 — see §7 |
| Time manipulation | change phone clock | server time only |
| Cross-tenant access | read other company | existing `companyId` scoping; session row carries `companyId` |
| Data over-exposure | storage keys in punch response | mobile response uses `toMySessionView()` |

## 3. Trust model — never trust a client boolean

| Category | Examples | How it is used |
|---|---|---|
| **Server-verified** | Play Integrity verdicts decoded by Google for our server; App Attest attestation + assertion verified against Apple's root and our stored key/counter; HMAC challenge; server time; idempotency; device status; server-computed travel speed, repeated coordinates, shared device | can produce STRONG / CRITICAL reasons |
| **Client-reported (untrusted)** | `mocked`, developer options, ADB, wireless ADB, root/jailbreak heuristics, emulator heuristics, debugger flag, fix timestamp, accuracy, coordinates | **WEAK** at most (an attacker controlling the client can set them to "clean"). Only *positive* indications count; "false" proves nothing. They can raise suspicion, never establish innocence. |

## 4. Android signals — feasibility

| Signal | API | Access | Expo | Reliability | Use |
|---|---|---|---|---|---|
| Mock location per fix | `Location.isMock()` (API 31+), `Location.isFromMockProvider()` (API 18–30, deprecated) | public, no extra permission | exposed by `expo-location` as `mocked` | catches common fake-GPS apps; root tools can hide it | WEAK |
| "Allow mock locations" setting | `Settings.Secure.ALLOW_MOCK_LOCATION` | deprecated since API 23 (no longer meaningful) | — | none on modern Android | not used |
| Which app is the mock-location app | AppOps `OPSTR_MOCK_LOCATION` per package | needs enumerating installed packages → `QUERY_ALL_PACKAGES` (restricted by Play policy) | — | — | **not used** (policy + privacy) |
| Developer Options enabled | `Settings.Global.DEVELOPMENT_SETTINGS_ENABLED` (API 17+) | public constant, readable without permission | custom native module | accurate, but many genuine users (and some OEM support staff) leave it on | WEAK (configurable down to INFO); **never blocks alone** |
| USB debugging | `Settings.Global.ADB_ENABLED` (API 17+) | public, readable | custom module | accurate; not proof of fraud | WEAK; never blocks alone |
| Wireless debugging | setting key `adb_wifi_enabled` (Android 11+) | **not a public SDK constant** — reading by key may work on some devices; **UNKNOWN / verify** | custom module | best-effort | WEAK if available, else `null` |
| App is debuggable | `ApplicationInfo.FLAG_DEBUGGABLE` on own app | public | custom module | release builds are never debuggable; a debuggable release means repackaging | covered better by Play Integrity |
| Emulator | build/hardware heuristics | public | custom module | weak, easy to fake | WEAK; Play Integrity device verdict is the strong check |
| Root | heuristics (su binary, test-keys, known root apps) | public file checks; package checks limited by package visibility | custom module or community lib (verify) | bypassable (Magisk hide) | WEAK |
| **Play Integrity** (via `@expo/app-integrity`, D-033; details `docs/spikes/integrity.md`) | standard request (`StandardIntegrityManager`, warm-up + request with `requestHash`) or classic (`IntegrityManager`, nonce) | Google Play services required; app linked to a Google Cloud project in Play Console | native module (Spike B) | strongest Android signal **when verified on the server** | §4.1 |

### 4.1 Play Integrity details

- Verdicts: `requestDetails` (our `requestHash`/nonce, timestamp), `appIntegrity.appRecognitionVerdict` (`PLAY_RECOGNIZED` / `UNRECOGNIZED_VERSION` / `UNEVALUATED`), `deviceIntegrity.deviceRecognitionVerdict` (labels such as `MEETS_BASIC_INTEGRITY`, `MEETS_DEVICE_INTEGRITY`, `MEETS_STRONG_INTEGRITY`; semantics changed in 2025 — **verify**), `accountDetails.appLicensingVerdict`, optional `environmentDetails` (Play Protect verdict, app access risk = apps that can capture screen/control the device).
- **Server validation:** the app sends the opaque token; our server calls Google's `decodeIntegrityToken` with a service account; we check `requestHash == SHA-256(challenge‖clientPunchId‖type)`, package name, timestamp freshness, then map verdicts to reasons. The app never interprets the verdict.
- Accounts/cost: Google Play Console developer account (one-time registration fee), Google Cloud project, service account. The API itself has no per-call charge; default quota is limited per app per day (historically 10,000/day) with a request form to raise it — **verify current quota**. Budget: ~2–4 calls per employee per day (registration rarely, each punch).
- Limits: needs Google Play services (devices without them → `UNAVAILABLE`); sideloaded/internal builds may return `UNRECOGNIZED_VERSION` unless installed from Play (use Play internal testing for QA); does **not** detect mock location by itself; a genuine, un-rooted phone with a fake-GPS app can still pass device integrity.

## 5. iOS signals — feasibility

There is no Developer Options/USB-debugging equivalent that apps can read.

| Signal | API | Expo | Reliability | Use |
|---|---|---|---|---|
| Simulated location per fix | `CLLocation.sourceInformation.isSimulatedBySoftware` (iOS 15+) | exposed by `expo-location` as `mocked` (Expo docs; D-034) | catches Xcode/developer-tool simulation; not all spoofing methods | WEAK |
| **App Attest** | `DCAppAttestService` (iOS 14+): `generateKey` → `attestKey(keyId, clientDataHash)` once → `generateAssertion` per punch | `@expo/app-integrity` (D-033); not supported on Simulator (`isSupported == false`) | proves requests come from **our genuine app** on a genuine Apple device; does **not** prove location is real; not a jailbreak detector | server-verified, §5.1 |
| DeviceCheck | 2 bits per device per developer team, via server API with an Apple-issued key | native + server | useful to remember "this device was abused" across reinstalls | not in v1 (D-025) |
| Jailbreak | file/sandbox/URL-scheme heuristics | custom module | bypassable | WEAK |
| Debugger attached | `sysctl` `P_TRACED` | custom module | bypassable | WEAK |

### 5.1 App Attest server validation

Registration: verify the attestation object (CBOR), certificate chain to Apple's App Attest root CA, nonce = SHA-256(authData‖clientDataHash) where clientDataHash = SHA-256(challenge), `rpIdHash` = SHA-256(`<TeamID>.<bundleId>`), counter 0, `aaguid` = production (`appattest`) vs development (`appattestdevelop`) as expected; store public key + key id + counter on `mobile_devices`.
Per punch: verify the assertion signature with the stored key over SHA-256(authenticatorData‖clientDataHash), `rpIdHash`, **counter strictly greater** than stored (replay guard), then save the new counter.
Accounts/cost: Apple Developer Program (annual fee); no per-call charge. Apple advises gradual rollout for large user bases because key attestation is rate-limited on Apple's side (**verify**). Unsupported devices → `UNAVAILABLE`.

## 6. Risk engine (server-side, explainable)

### 6.1 Reasons and strengths (defaults — configurable per company via `mobile_signal_overrides`)

| Code | Source | Default strength | Basis |
|---|---|---|---|
| `CHALLENGE_REPLAYED` / `CHALLENGE_FOREIGN` | server | CRITICAL (request refused with 409, never reaches risk scoring) | replay is proof of tampering |
| `INTEGRITY_INVALID_SIGNATURE` (bad App Attest assertion, counter not increasing, wrong app id; Play token for another package / wrong requestHash) | server-verified | CRITICAL | cryptographic evidence |
| `APP_NOT_RECOGNIZED` (Play `UNRECOGNIZED_VERSION` in a production build) | server-verified | STRONG | modified or sideloaded app |
| `DEVICE_INTEGRITY_FAILED` (no `MEETS_DEVICE_INTEGRITY`) | server-verified | STRONG | rooted/emulator/uncertified |
| `INTEGRITY_UNAVAILABLE` (no Play services, iOS unsupported, Google/Apple unreachable) | server | WEAK (STRONG if `mobile_require_integrity`) | absence ≠ guilt |
| `DEVICE_SHARED_TODAY` (same installation used by another employee today) | server | STRONG | buddy punching pattern |
| `IMPOSSIBLE_TRAVEL` (speed between this and the employee's previous punch > 150 km/h, distance > 5 km) | server | STRONG | physical impossibility; thresholds to tune |
| `REPEATED_EXACT_COORDINATES` (identical lat/lng to ≥ 6 decimals as an earlier punch) | server | WEAK | real GPS jitters; replayed data doesn't |
| `ABNORMAL_ACCURACY` (accuracy ≤ 1 m or exactly round values repeated) | server on client data | WEAK | spoofers often send fixed accuracy |
| `STALE_FIX` (reported fix age > 60 s or fix older than challenge) | client data | WEAK | cached location |
| `MOCK_LOCATION_REPORTED` (`mocked=true` / iOS simulated) | client | WEAK | positive indication only |
| `DEVELOPER_OPTIONS_ON`, `USB_DEBUGGING_ON`, `WIRELESS_DEBUGGING_ON` | client | WEAK (can be INFO) | risk indicators, not proof |
| `ROOT_HEURISTIC`, `JAILBREAK_HEURISTIC`, `EMULATOR_HEURISTIC`, `DEBUGGER_ATTACHED` | client | WEAK | bypassable heuristics |
| `DEVICE_PENDING_OR_NEW` (first punch from a device registered < 24 h) | server | INFO | context for reviewers |

### 6.2 Level rules (corroboration, no arbitrary scores)

| Level | Rule |
|---|---|
| **HIGH_RISK** | any CRITICAL, **or** ≥ 2 STRONG, **or** 1 STRONG + ≥ 2 WEAK |
| **SUSPICIOUS** | 1 STRONG, **or** ≥ 1 WEAK |
| **NORMAL** | only INFO or nothing |

Basis: the user's rule that one weak signal is never proof and HIGH RISK needs verified evidence or multiple corroborating indicators. Thresholds are a starting point to validate with pilot data ("monitor mode": compute and store levels, act only with REVIEW) before any BLOCK policy.

### 6.3 Outcomes (company policy, Q-02)

| Level | Default action | Mechanism |
|---|---|---|
| NORMAL | accept | `punch()` as today |
| SUSPICIOUS | accept → **review** | `punch(..., { forceReview: true })` records `PRESENT_FROM_OUTSIDE` → existing outdoor approval queue (`hrms_attendance_outdoor`): approve → `REMOTE`, reject → `OutdoorRejection` (times trimmed, employee can clarify) |
| HIGH_RISK | pilot: review; later per policy: **block** | block = no session, meta stored with `outcome BLOCKED`, `422 ATTENDANCE_BLOCKED_BY_RISK` with a neutral message ("We couldn't verify this phone. Contact HR.") |

Nobody is labelled "fraud" by the system. Reviewers see the reasons list (B-17). What the employee sees is Q-20 (default: a neutral "sent for review" message, no signal list, to avoid teaching evasion).

Note: routing a device-risk punch through the *outdoor* queue reuses existing approval UI but the queue is named for location. Reviewer UI must show "Flagged: <reasons>" so approvers aren't confused (B-17).

## 7. Face verification analysis

> **Decided 2026-11-03 (D-012, user): same as the web app** (on-device match, `facePhotoId`, existing server check; SW-1 accepted). Analysis below kept for history.

| Option | Assurance | Liveness | Cost / effort | Privacy | Risk |
|---|---|---|---|---|---|
| Copy web model (on-device match, send `facePhotoId`) | **low** — client can skip match (SW-1) | none | medium (RN face libs, model size on low-end phones) | enrolled photos downloaded to phone in memory | false sense of security |
| Selfie-only on mobile (`requireFaceOnMobile=false`), managers review selfies | low, but honest | none | lowest | selfies only (already collected) | relies on human review |
| Server-side match (compare selfie with enrolled photos on our server, e.g. face-api on Node with a TF backend — feasibility **UNKNOWN**) | medium-high (server decides) | none unless added | medium; CPU on server | descriptors computed server-side; retention policy needed | false reject in bad light → needs review fallback |
| Server-side match + liveness (vendor SDK/API, e.g. cloud face-liveness services) | high | yes | per-check vendor fees (**verify pricing**), vendor contract, data transfer outside the company | biometric data to a third party — DPDP consent needed | vendor lock-in |
| On-device liveness (passive) + server match | medium-high | partial | high (native ML) | — | spoofable by skilled attackers |

Recommendation for approval (Q-01): **v1 = selfie on every punch + server-side match if Spike A shows it is feasible on our server; otherwise selfie-only with review.** Do not claim face verification is secure unless it is decided on the server. Do not make it mandatory on mobile without explicit approval. The existing `requireFace=true` default means a decision is required before Phase 5.

## 8. Request security summary

| Control | Where |
|---|---|
| Server time | `punch()` (existing) |
| Single-use HMAC challenge (120 s), bound to session + type | B-07 |
| Integrity token / assertion bound to SHA-256(challenge‖clientPunchId‖type) | B-08 |
| Idempotency (`clientPunchId`) with stored response | B-06 |
| Existing duplicate guards (pre-check, guarded update, partial unique index) | existing |
| Device status check | adapter |
| Audit log of every punch outcome incl. blocked | B-12 |
| Minimum metadata: no raw integrity tokens, no device serials, no installed-app lists | B-06 design |

## 9. App hardening (Phase 7)

Release builds: no response logging, Hermes, R8 on Android; SecureStore excluded from backups; no WebView with remote content; no gallery access (camera only, so old photos can't be uploaded); `npm audit` before each release; root/jailbreak results are signals only.

## 10. Privacy

- **Minimisation:** one location fix per punch (plus a live fix while the dashboard is open, never stored); no background location; no contacts/storage/photo-library permission; **microphone only when the user taps "record voice note"** (CR-001 — voice notes are uploaded with the record, same access rules, no background recording); no IMEI/serial/advertising id; no installed-app scanning; no analytics SDK in v1.
- **Biometric data:** enrolled photos are images today (no stored descriptors). Any server-side matching or vendor liveness needs an explicit notice/consent and retention rule.
- **Law:** India's Digital Personal Data Protection Act, 2023 likely applies to selfies and location. The company needs a notice, purpose, retention period (selfie retention today: **no deletion job exists** — Q-15) and a grievance contact. Store listings need a public privacy policy URL.
- **Transparency to employees:** the app explains why location, camera and device checks are used, before OS prompts.
- **Risk data:** stored as reasons (codes), visible to reviewers with HRMS scope only; not shown publicly; retention same as attendance.

## 11. Account controls

Sign out device, sign out all, revoke a device, password change kills all sessions (existing check), admin reset/suspend revokes (B-13), HR device list/approval (B-20, optional).
