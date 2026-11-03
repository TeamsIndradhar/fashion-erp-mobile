# Inventory Manager

Who: STORE_MANAGER, WAREHOUSE_USER. Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| INV-001 | [Inventory Home](INV-001-inventory-home/screen-spec.md) | READY_FOR_REVIEW | `inventory.view / fg_inventory.view / material_request.view` | [png](INV-001-inventory-home/screen.png) |
| INV-002 | [Stock balance (list)](INV-002-stock-balance-list/screen-spec.md) | READY_FOR_REVIEW | `inventory.view` | [png](INV-002-stock-balance-list/screen.png) |
| INV-003 | [Stock item ledger](INV-003-stock-item-ledger/screen-spec.md) | NOT_STARTED | `inventory.view` | — |
| INV-004 | [Material requests list / issue](INV-004-material-requests-list-issue/screen-spec.md) | NOT_STARTED | `material_request.view/edit` | — |
| INV-005 | [FG stock list](INV-005-fg-stock-list/screen-spec.md) | NOT_STARTED | `fg_inventory.view` | — |
| INV-006 | [Stock movements / receive transfers](INV-006-stock-movements-receive-transfers/screen-spec.md) | NOT_STARTED | `inventory.view/create` | — |
| INV-007 | [Barcode scanner](INV-007-barcode-scanner/screen-spec.md) | NOT_STARTED | `barcodes.scan` | — |

