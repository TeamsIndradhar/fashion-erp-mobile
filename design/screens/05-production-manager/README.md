# Production Manager

Who: PRODUCTION_MANAGER, QC_MANAGER, SAMPLING_MANAGER (+ EXTERNAL_UNIT_USER pending). Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| EXT-001 | [External unit (contractor) home](EXT-001-external-unit-contractor-home/screen-spec.md) | NOT_STARTED | `production.view/create (own contractor)` | — |
| PM-001 | [Production Manager Home](PM-001-production-manager-home/screen-spec.md) | READY_FOR_REVIEW | `production.view (+view_all); reports.view for KPIs` | [png](PM-001-production-manager-home/screen.png) |
| PM-002 | [Production orders (list)](PM-002-production-orders-list/screen-spec.md) | READY_FOR_REVIEW | `production.view` | [png](PM-002-production-orders-list/screen.png) |
| PM-003 | [Production order details](PM-003-production-order-details/screen-spec.md) | READY_FOR_REVIEW | `production.view; actions per production.edit/approve/cancel` | [png](PM-003-production-order-details/screen.png) |
| PM-004 | [Job order details (manager)](PM-004-job-order-details-manager/screen-spec.md) | NOT_STARTED | `production.view` | — |
| PM-005 | [Job work orders (contractor)](PM-005-job-work-orders-contractor/screen-spec.md) | NOT_STARTED | `production.view` | — |
| PM-006 | [QC inspections](PM-006-qc-inspections/screen-spec.md) | NOT_STARTED | `qc.view` | — |
| PM-007 | [Lot list / lot timeline](PM-007-lot-list-lot-timeline/screen-spec.md) | NOT_STARTED | `production.view` | — |
| PM-008 | [Sampling list & detail](PM-008-sampling-list-detail/screen-spec.md) | NOT_STARTED | `sampling.view` | — |

