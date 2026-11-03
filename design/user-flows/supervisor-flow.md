# Supervisor / team leader flow

Screens: SUP-001 … SUP-007 plus common employee screens. Bottom nav adds **Approvals**.

```mermaid
flowchart TD
  H[SUP-001 Supervisor Home] --> A[SUP-004 Pending production approvals]
  A --> E[SUP-005 Entry: approve / reject / edit]
  H -->|hrms_attendance_team.view| TA[SUP-002 Team attendance today] --> TM[SUP-003 Member month]
  H --> TW[SUP-006 Team work — BACKEND_GAP]
  H -->|reports.view| R[SUP-007 Team reports] --> RV[ADM-006 Report viewer]
  H --> PUNCH[EMP punch flow]
```

Important: by default `PRODUCTION_SUPERVISOR` has HRMS **self-service only** — no team attendance or HR approvals. Those cards appear only if the company grants `hrms_attendance_team.view` / approve permissions (decision D-D06). Production approvals are limited by branch, production stage and reporting team; nobody approves their own entry.
