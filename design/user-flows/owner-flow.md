# Company owner flow

Screens: OWN-001 … OWN-007. There is no "Owner" role in the ERP — the owner dashboard is shown to users who hold the business-report permissions (`reports.view` + `financial_reports.view`), typically SUPER_ADMIN or MANAGEMENT.

```mermaid
flowchart TD
  H[OWN-001 Owner Dashboard: sales hero + AR/AP/production/stock/people/approvals] --> S[OWN-002 Sales analytics]
  H --> F[OWN-005 Financial summary]
  H --> P[OWN-003 Production analytics — batch 2]
  H --> I[OWN-004 Inventory analytics — batch 2]
  H --> HR[OWN-006 HRMS summary — batch 2]
  H --> AL[OWN-007 Alerts — gap]
  S & F & P & I & HR --> RV[ADM-006 Report viewer]
```

Every number maps to an existing report (`dashboard/executive-dashboard`, `business-performance/*`, `receivables/*`, `payables/*`, `accounts/profit-and-loss`, `expenses/financial-accounts-balances`, `production/*`, `inventory/*`, `attendance/*`). Not available today: numeric KPI JSON (G-03), cash-flow trend, alert aggregation, SAM/efficiency %. Nothing is invented — those cards stay as gaps until approved.
