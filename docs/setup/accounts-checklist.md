# Developer accounts — setup checklist (for the company)

Decision (2026-11-03): **the company creates and owns all accounts** (Q-08). Create them under the company's legal entity, not a personal name, so ownership stays with the company. Fees and requirements below are from public information — check the current amounts at sign-up.

**Never send passwords, keys or service-account JSON files in chat or email, and never commit them to git.** Share only the non-secret identifiers listed in the last section.

## 0. Before you start

- [ ] **D-U-N-S number** for the company (free from Dun & Bradstreet; can take a few days to a couple of weeks). Both Google (organisation account) and Apple (organisation enrolment) ask for it.
- [ ] A shared company email for the accounts (e.g. `mobile-apps@<company domain>`), not a personal mailbox.
- [ ] Decide the app name shown in stores and the app ID. **Proposal:** `in.indradhar.fashionerp` (reverse of the company domain `indradhar.in`). This ID cannot be changed after the first upload — please confirm.

## 1. Google Play Console (Android distribution + Play Integrity)

- [ ] Create an **organisation** developer account at play.google.com/console (one-time registration fee; identity + D-U-N-S verification).
- [ ] Create the app entry with the confirmed package name.
- [ ] Set up the **Internal testing** track (testers' Google accounts) — needed so Play Integrity recognises test builds.
- [ ] Play Console → **App integrity** → Play Integrity API → **link a Google Cloud project** (step 2).
- [ ] Optional (later): opt in to extra verdicts (device attributes, recent device activity, app access risk, Play Protect).

## 2. Google Cloud (server side of Play Integrity)

- [ ] Create a Google Cloud project owned by the company (e.g. `fashion-erp-mobile`).
- [ ] Enable the **Google Play Integrity API** in that project.
- [ ] Create a **service account** for the ERP server; create a JSON key. **Give the key file only to the person who manages the ERP server** — it goes into the server's secret store, not into git or chat.
- [ ] Note the **project number** (not the name) — the app needs it.
- [ ] Default quota is 10,000 integrity requests/day; request an increase later only if needed (app must be on Play first).

## 3. Apple Developer Program (iPhone distribution + App Attest)

- [ ] Enrol as an **organisation** at developer.apple.com (annual fee; legal entity + D-U-N-S; Apple may call to verify).
- [ ] Note the **Team ID**.
- [ ] Certificates, Identifiers & Profiles → register an **App ID** with the confirmed bundle ID and enable the **App Attest** capability.
- [ ] App Store Connect → create the app record.
- [ ] TestFlight → add internal testers.
- [ ] Have at least one **physical iPhone** for testing (App Attest does not work on the simulator).

## 4. Expo (build service)

- [ ] Create an Expo account and an **organisation** for the company (free tier is enough to start).
- [ ] Add the developers as members.
- [ ] Later (Phase 2), EAS will store the Android upload key and iOS signing certificates. The account owner must keep the Android upload-key backup safe.

## 5. Test phones (for Phase 0 device tests)

- [ ] Android 10 or 11 (budget phone), Android 12 or 13, Android 14 or newer (Samsung or Pixel), one iPhone (iOS 15+).
- [ ] At least one phone typical of what factory workers use.

## 6. Send back to the project (non-secret only)

| Item | Example | Secret? |
|---|---|---|
| Confirmed app ID / bundle ID | `in.indradhar.fashionerp` | no |
| App name in stores | "Fashion ERP" | no |
| Google Cloud **project number** | `123456789012` | no |
| Apple **Team ID** | `ABCDE12345` | no |
| Expo organisation name | `indradhar` | no |
| Who holds the service-account key / signing keys | name + role | no (the files themselves are secret) |

When these are ready, the Spike B device tests (`docs/spikes/integrity.md` §6) can run.
