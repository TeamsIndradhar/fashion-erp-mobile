# Company admin flow

Screens: ADM-001 … ADM-006. In the ERP the company admin is `SUPER_ADMIN` (no separate "Company Admin" role); `MANAGEMENT` sees most of it read/approve.

```mermaid
flowchart TD
  H[ADM-001 Admin Dashboard] --> A[ADM-002 Pending approvals — grouped by module]
  A --> PR[ACC-002 Payment requests] & PE[SUP-004 Production entries] & LV[HR-003 Leave] & OP[HR-005 Punch review] & PO[PUR-002 Purchase orders]
  H --> EM[ADM-003 Employee summary — batch 2]
  H --> US[ADM-004 Users & roles view — batch 2]
  H --> R[ADM-005 Reports] --> RV[ADM-006 Report viewer]
  H --> MOD[SHR-002 All Modules]
```

Rules: financial cards only with finance/report permissions (an admin is not automatically a finance user); editing roles/permissions stays on the web (proposal, D-D07); company-wide counts and the cross-module approval total need new APIs (G-04, G-08).
