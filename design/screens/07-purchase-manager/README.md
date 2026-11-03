# Purchase Manager

Who: STORE_MANAGER (no dedicated purchase role exists). Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| PUR-001 | [Purchase Home](PUR-001-purchase-home/screen-spec.md) | READY_FOR_REVIEW | `purchase_order.view` | [png](PUR-001-purchase-home/screen.png) |
| PUR-002 | [Purchase orders (list)](PUR-002-purchase-orders-list/screen-spec.md) | READY_FOR_REVIEW | `purchase_order.view; approve button needs purchase_order.approve` | [png](PUR-002-purchase-orders-list/screen.png) |
| PUR-003 | [PO details + approve](PUR-003-po-details-approve/screen-spec.md) | NOT_STARTED | `purchase_order.view/approve` | — |
| PUR-004 | [Goods receipts list](PUR-004-goods-receipts-list/screen-spec.md) | NOT_STARTED | `inventory.view` | — |

