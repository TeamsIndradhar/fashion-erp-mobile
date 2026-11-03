# Spike A — Server-side face verification (Phase 0) — IN PROGRESS

Question (Q-01): can the ERP server itself compare a punch selfie with the employee's enrolled face photos, so the decision no longer depends on the client (SW-1)?

## Done so far (2026-11-03)

**1. What the existing library offers** (`@vladmandic/face-api` 1.7.15, already a dependency of `fashion-erp`, used in the browser today):
- It ships Node builds: `dist/face-api.node.js` (needs `@tensorflow/tfjs-node`, native binaries), `dist/face-api.node-wasm.js` (needs `@tensorflow/tfjs` + `@tensorflow/tfjs-backend-wasm`, pure WebAssembly), `dist/face-api.node-gpu.js`.
- **None of the TensorFlow packages is installed in `fashion-erp`** (no `node_modules/@tensorflow`). Server-side matching therefore needs **two new dependencies** (`@tensorflow/tfjs@4.22.0`, `@tensorflow/tfjs-backend-wasm@4.22.0` — the versions face-api 1.7.15 is built against). Needs approval (D-031).
- Recommended backend: **wasm** (no native build, works on Windows dev and Linux servers). `tfjs-node` native binaries were not tried.
- `sharp` (already in `fashion-erp`, 0.35.3) can decode the selfie to raw RGB for the model — no `canvas` package needed.

**2. Throwaway run** — in the session scratchpad, **outside both repositories**; nothing committed or installed in `fashion-erp`:
- Environment: this Windows dev PC, Node v24.15.0, wasm backend.
- Model load (SSD MobileNet, Tiny detector, 68 landmarks, recognition): **~0.2 s**, once per server process.
- Detection only, image resized to 640 px (sample image had no detectable face, so landmarks + descriptor were not timed):
  - Tiny face detector: **110–130 ms** per image (first call 280 ms).
  - SSD MobileNet: **460–560 ms** per image (first call 890 ms).
- Process memory: **~365 MB RSS**.

## Not done yet (needs the user)

| Item | Why blocked |
|---|---|
| Time for full detect + landmarks + descriptor on a real face | no face test image; I did not use real employees' enrolled photos without permission |
| Accuracy — false accept / false reject at the current threshold (0.45) | needs consented photos of 3–5 volunteers (enrolment + several selfies each, good and bad light) |
| Production server CPU/RAM | host specs of `erp.indradhar.in` unknown (behind nginx) |
| Liveness (photo-of-a-photo attacks) | face-api has no liveness; needs a separate decision (vendor or on-device) |

## Preliminary reading

Server-side matching with the library the ERP already uses looks **technically feasible** (runs on Node 24 via wasm, modest memory, sub-second detection). Its real cost and accuracy are not known until a test with consented faces. It would close SW-1 (server decides the match) but **not** liveness.

## Next step

User decision: may we run the accuracy test with 3–5 consenting volunteers' photos (kept only in the scratchpad, deleted after the test)? Then finish this report with numbers and a recommendation for Q-01.
