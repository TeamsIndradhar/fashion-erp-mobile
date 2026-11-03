# Inventory Manager

Who: STORE_MANAGER, WAREHOUSE_USER. Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| INV-001 | [Inventory Home](INV-001-inventory-home/screen-spec.md) | READY_FOR_REVIEW | `inventory.view / fg_inventory.view / material_request.view` | [png](INV-001-inventory-home/screen.png) |
| INV-002 | [Stock balance (list)](INV-002-stock-balance-list/screen-spec.md) | READY_FOR_REVIEW | `inventory.view` | [png](INV-002-stock-balance-list/screen.png) |
| INV-003 | [Stock item ledger](INV-003-stock-item-ledger/screen-spec.md) | READY_FOR_REVIEW | `inventory.view + reports.view` | [png](INV-003-stock-item-ledger/screen.png) |
| INV-004 | [Material requests — approve / issue](INV-004-material-requests-approve-issue/screen-spec.md) | READY_FOR_REVIEW | `material_request.view; approve / issue per permission` | [png](INV-004-material-requests-approve-issue/screen.png) |
| INV-005 | [Finished goods stock](INV-005-finished-goods-stock/screen-spec.md) | READY_FOR_REVIEW | `fg_inventory.view` | [png](INV-005-finished-goods-stock/screen.png) |
| INV-006 | [Stock movements / receive transfer](INV-006-stock-movements-receive-transfer/screen-spec.md) | READY_FOR_REVIEW | `inventory.view; receive needs inventory.create` | [png](INV-006-stock-movements-receive-transfer/screen.png) |
| INV-007 | [Barcode scanner](INV-007-barcode-scanner/screen-spec.md) | READY_FOR_REVIEW | `barcodes.scan` | [png](INV-007-barcode-scanner/screen.png) |

