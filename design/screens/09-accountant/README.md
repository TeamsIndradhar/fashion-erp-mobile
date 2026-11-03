# Accountant

Who: ACCOUNTS_MANAGER, ACCOUNTS_EXECUTIVE. Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| ACC-001 | [Accounts Home](ACC-001-accounts-home/screen-spec.md) | READY_FOR_REVIEW | `payment_requests.view (+approve/post); financial_reports.view for AR/AP` | [png](ACC-001-accounts-home/screen.png) |
| ACC-002 | [Payment request approval inbox](ACC-002-payment-request-approval-inbox/screen-spec.md) | READY_FOR_REVIEW | `payment_requests.approve (no self-approval)` | [png](ACC-002-payment-request-approval-inbox/screen.png) |
| ACC-003 | [Payout queue / pay request](ACC-003-payout-queue-pay-request/screen-spec.md) | READY_FOR_REVIEW | `payment_requests.post` | [png](ACC-003-payout-queue-pay-request/screen.png) |
| ACC-004 | [Invoices](ACC-004-invoices/screen-spec.md) | READY_FOR_REVIEW | `invoices.view` | [png](ACC-004-invoices/screen.png) |
| ACC-005 | [Receivables / payables aging](ACC-005-receivables-payables-aging/screen-spec.md) | READY_FOR_REVIEW | `financial_reports.view + reports.view` | [png](ACC-005-receivables-payables-aging/screen.png) |

