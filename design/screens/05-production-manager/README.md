# Production Manager

Who: PRODUCTION_MANAGER, QC_MANAGER, SAMPLING_MANAGER (+ EXTERNAL_UNIT_USER pending). Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| EXT-001 | [External unit (contractor) home](EXT-001-external-unit-contractor-home/screen-spec.md) | READY_FOR_REVIEW | `production.view / create (own contractor only)` | [png](EXT-001-external-unit-contractor-home/screen.png) |
| PM-001 | [Production Manager Home](PM-001-production-manager-home/screen-spec.md) | READY_FOR_REVIEW | `production.view (+view_all); reports.view for KPIs` | [png](PM-001-production-manager-home/screen.png) |
| PM-002 | [Production orders (list)](PM-002-production-orders-list/screen-spec.md) | READY_FOR_REVIEW | `production.view` | [png](PM-002-production-orders-list/screen.png) |
| PM-003 | [Production order details](PM-003-production-order-details/screen-spec.md) | READY_FOR_REVIEW | `production.view; actions per production.edit/approve/cancel` | [png](PM-003-production-order-details/screen.png) |
| PM-004 | [Job order details (manager)](PM-004-job-order-details-manager/screen-spec.md) | READY_FOR_REVIEW | `production.view; assign needs production.edit` | [png](PM-004-job-order-details-manager/screen.png) |
| PM-005 | [Job work orders (contractor)](PM-005-job-work-orders-contractor/screen-spec.md) | READY_FOR_REVIEW | `production.view (+ view_all)` | [png](PM-005-job-work-orders-contractor/screen.png) |
| PM-006 | [QC inspections (report view)](PM-006-qc-inspections-report-view/screen-spec.md) | READY_FOR_REVIEW | `qc.view + reports.view` | [png](PM-006-qc-inspections-report-view/screen.png) |
| PM-007 | [Lot timeline](PM-007-lot-timeline/screen-spec.md) | READY_FOR_REVIEW | `production.view` | [png](PM-007-lot-timeline/screen.png) |
| PM-008 | [Sampling list & decision](PM-008-sampling-list-decision/screen-spec.md) | READY_FOR_REVIEW | `sampling.view; decision needs approve/reject` | [png](PM-008-sampling-list-decision/screen.png) |

