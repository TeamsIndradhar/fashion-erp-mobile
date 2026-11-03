# Dispatch Manager

Who: DISPATCH_MANAGER, WAREHOUSE_USER. Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
| DSP-001 | [Dispatch Home](DSP-001-dispatch-home/screen-spec.md) | READY_FOR_REVIEW | `dispatch.view` | [png](DSP-001-dispatch-home/screen.png) |
| DSP-002 | [Dispatch details](DSP-002-dispatch-details/screen-spec.md) | READY_FOR_REVIEW | `dispatch.view; actions per dispatch.edit/post` | [png](DSP-002-dispatch-details/screen.png) |
| DSP-003 | [Carton scan / packing](DSP-003-carton-scan-packing/screen-spec.md) | READY_FOR_REVIEW | `dispatch.edit + barcodes.scan` | [png](DSP-003-carton-scan-packing/screen.png) |

