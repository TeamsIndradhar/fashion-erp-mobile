# Purchase Manager

Who: STORE_MANAGER (no dedicated purchase role exists). Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| PUR-001 | [Purchase Home](PUR-001-purchase-home/screen-spec.md) | READY_FOR_REVIEW | `purchase_order.view` | [png](PUR-001-purchase-home/screen.png) |
| PUR-002 | [Purchase orders (list)](PUR-002-purchase-orders-list/screen-spec.md) | READY_FOR_REVIEW | `purchase_order.view; approve button needs purchase_order.approve` | [png](PUR-002-purchase-orders-list/screen.png) |
| PUR-003 | [Purchase order details + approve](PUR-003-purchase-order-details-approve/screen-spec.md) | READY_FOR_REVIEW | `purchase_order.view; approve needs purchase_order.approve (no self-approval)` | [png](PUR-003-purchase-order-details-approve/screen.png) |
| PUR-004 | [Goods receipts](PUR-004-goods-receipts/screen-spec.md) | READY_FOR_REVIEW | `inventory.view` | [png](PUR-004-goods-receipts/screen.png) |

