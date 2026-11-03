# Production worker flow

Screens: WRK-001 … WRK-010 plus all common employee screens. Data scope: only the worker's own assignments (existing `production-scope.ts`), self entry only if `Employee.selfEntryEnabled`.

```mermaid
flowchart TD
  H[WRK-001 Worker Home] --> L[WRK-002 My Assigned Work]
  L --> D[WRK-003 Task details]
  D --> SP[WRK-004 Submit progress] -->|POST self-progress → PENDING| C[WRK-005 Confirmation]
  C --> HIS[WRK-006 My submissions]
  D --> HB[WRK-007 Hand back pieces]
  D --> LOT[WRK-008 Lot details]
  H --> E[WRK-009 Earnings — only if company allows workers to see rates]
  H -->|self entry off / not linked| OFF[WRK-010 Self-entry not enabled]
  H --> PUNCH[EMP punch flow]
```

The worker never sees create/approve production actions, other workers' entries, or job orders not assigned to them. Approval results currently create no notification (gap G-11) — WRK-006 shows the status.
