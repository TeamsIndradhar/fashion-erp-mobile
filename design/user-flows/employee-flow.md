# Common employee flow

Screens: EMP-001 … EMP-031 (EMP-028…031 pending in batch 2). Bottom nav: Home · My Work · Alerts · Profile (Modules appears only if the user can view more than self-service).

```mermaid
flowchart TD
  H[EMP-001 Employee Home] -->|Tap to Punch| PERM{location permission + precise?}
  PERM -- no --> LP[EMP-003 Location permission]
  PERM -- yes --> G[EMP-004 GPS check: accuracy ≤ company limit]
  G -->|weak after 30 s| G
  G -->|ok| SF[EMP-005 Selfie / face step]
  SF --> CF{IN or OUT?}
  CF -- IN --> CI[EMP-006 Confirm Punch In]
  CF -- OUT --> CO[EMP-008 Confirm Punch Out]
  CI & CO --> SV[(server: challenge, integrity, risk engine, existing punch())]
  SV -->|NORMAL| OK[EMP-007 Success]
  SV -->|SUSPICIOUS / outside| RV[EMP-009 Sent for review]
  SV -->|blocked by approved policy / device revoked| SEC[EMP-010 Security warning]
  H --> AD[EMP-002 Attendance dashboard]
  H --> MR[EMP-011 Monthly report] --> DD[EMP-013 Day details] --> RM[EMP-014 Remark]
  H --> RQ[EMP-015 My Requests]
  RQ -->|payment_requests.create| EX[EMP-016 Expense form] --> EH[EMP-017 History] --> ED[EMP-018 Details]
  RQ -->|hrms_salary_advance.create| SA[EMP-019 Salary advance]
  RQ -.batch 2.-> LV[EMP-028 Leave] & CR[EMP-029 Correction]
  H --> N[EMP-020 Notifications] --> ND[EMP-021 Details → record]
  H --> P[EMP-022 Profile] --> CP[EMP-023 Change password]
  P --> DEV[EMP-025 Devices] & SET[EMP-024 Settings] & HELP[EMP-026 Help] & AB[EMP-027 About] & LO[AUTH-008 Logout]
```

Note: expense-request tiles show only for users with `payment_requests.create` — by default workers, supervisors and warehouse users do not have it (decision D-D04).
