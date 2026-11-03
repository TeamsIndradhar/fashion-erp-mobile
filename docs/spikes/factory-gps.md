# Spike C — Factory GPS field test (Phase 0) — READY TO RUN

**Why:** from different factory floors the web ERP has shown about **200–225 m** apparent distance from the office point, while the office radius is about **100 m** and the accuracy limit is **50 m** by default (`AttendanceSettings.gpsAccuracyMeters`; production value unknown). Before any threshold or fallback decision (Q-13, D-028, D-029) we need real numbers per floor and per phone.

**What this test answers**
1. Is the configured office point correct?
2. How far off, and how "accurate" by its own report, is GPS on each floor, for each phone type?
3. Does a native app (later) need to do better than the browser — i.e. is the problem the phone/building, or the web page?
4. Which fix works: correct the office point, add a location per building block, change the accuracy rule, or a review fallback (`04` §6)?

**What this test does NOT do:** change any ERP setting, punch real attendance, or install anything on the server.

## 1. Before the visit (HR / admin)

- [ ] From the web ERP **Attendance → Settings**, copy for every active office location: name, latitude, longitude, radius (m). Also note the company's **GPS accuracy limit** (m). Fill sheet B.
- [ ] Draw or list the test spots: for each building — ground floor, each upper floor, cutting/stitching/finishing halls, store, gate, open yard (open sky). Give each a short code (e.g. `B1-F0-CUT`).
- [ ] Phones (as many as available, minimum two):
  - one budget Android typical of factory workers,
  - one mid-range Android (Samsung/Xiaomi),
  - one iPhone,
  - for each: model, OS version, Wi-Fi on/off.
- [ ] On each phone install **any GPS test app that shows latitude, longitude and accuracy in metres** (several free ones exist in Play Store / App Store; choose one, write its name in the sheet). Turn on **Precise location** for it.
- [ ] One **test employee login** (not a real worker) for the web comparison in step 3.3. Do **not** use a real employee — the web flow records attendance.
- [ ] Charge phones; plan about 10 minutes per spot.

## 2. Reference point per building

For each building, pick one point you can identify on a satellite map (e.g. main door, gate pillar).
- Get its true coordinates from a satellite map (long-press → copy coordinates) **or** stand there in open sky and average 10 readings with accuracy ≤ 5 m.
- Record in sheet B (`ref_lat`, `ref_lng`).
- Compare with the configured office point: if they are far apart, the office point itself may be wrong — that alone can explain large distances.

## 3. At each test spot

### 3.1 Native readings (per phone)
1. Stand still. Wait 30 s after opening the GPS app.
2. Record **5 readings, about 10 s apart**: latitude, longitude, accuracy (m), time.
3. Repeat with **Wi-Fi ON** and **Wi-Fi OFF** (Wi-Fi improves indoor location on many Android phones even when not connected).
4. Note anything unusual (near window, under metal roof, basement, heavy machines running).

### 3.2 Time to first good fix (per phone, once per spot)
Close and reopen the GPS app; record seconds until accuracy first reaches ≤ 50 m (or "never in 60 s").

### 3.3 Web ERP comparison (one phone, test login only, a few spots)
On the test employee's phone, open `https://erp.indradhar.in/attendance/my` and try a punch from: one upper floor, one hall, the yard. Record the message shown (accepted inside / accepted outside with distance / "GPS accuracy is too low (… m)"). Punch out again so the test login has no open session. Tell HR these are test records.

## 4. Data sheets

- **Sheet A — readings:** `docs/spikes/factory-gps-sheet.csv` (one row per reading). Columns: `date, spot_code, building, floor, area, phone_model, os, gps_app, wifi_on, reading_no, time, lat, lng, accuracy_m, notes`.
- **Sheet B — locations:** fill below.

| Location (as in ERP) | ERP lat | ERP lng | ERP radius m | ref_lat (surveyed) | ref_lng | Notes |
|---|---|---|---|---|---|---|
| | | | | | | |

Company GPS accuracy limit (m): ______

## 5. After the visit — analysis (Claude Code will do this from the filled sheets)

For each reading compute (Haversine, same formula as `evaluateGeofence()`):
- distance to the **ERP office point**, distance to the **surveyed reference point**,
- whether the **current rules** would accept it: `accuracy ≤ limit` and inside `max(10, radius)`,
- "true error" = distance from the reading to where the person actually stood (if the spot is mappable).

Per floor × phone, report: median and worst distance, median reported accuracy, % of readings the current rules would **reject** (accuracy) / mark **outside** (distance), Wi-Fi on vs off, time to fix, and web vs native difference.

**Output:** a short table + a recommendation among the options in `04` §6:
a. fix the office point / add one location per building block (configuration only),
b. keep current rules,
c. low-accuracy punch → review instead of reject (rule change, needs approval),
d. per-location accuracy limit,
e. Wi-Fi/BLE presence (future).

No setting is changed without the user's approval.

## 6. Privacy note

The readings are from test phones at the workplace; they contain no employee data. Do not use real employees' phones or logins.
