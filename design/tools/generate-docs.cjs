// Generates per-screen spec files and the screen-inventory documents from the prototype registry.
// Single source of truth = design/prototypes/screens-*.js. Usage: node design/tools/generate-docs.cjs
const fs = require("fs");
const path = require("path");
const { loadScreens, folderOf } = require("./load-screens.cjs");

const DESIGN = path.join(__dirname, "..");
const VERSION = "Design v1.0 · Batch 1 · 2026-11-03";
const CATS = {
  "01-authentication": ["Authentication", "Everyone before sign-in"],
  "02-common-employee": ["Common Employee", "Every employee with HRMS self-service (most roles)"],
  "03-production-worker": ["Production Worker", "PRODUCTION_WORKER and any assigned-only production user"],
  "04-supervisor": ["Supervisor / Team Leader", "PRODUCTION_SUPERVISOR; production approvers"],
  "05-production-manager": ["Production Manager", "PRODUCTION_MANAGER, QC_MANAGER, SAMPLING_MANAGER (+ EXTERNAL_UNIT_USER pending)"],
  "06-inventory-manager": ["Inventory Manager", "STORE_MANAGER, WAREHOUSE_USER"],
  "07-purchase-manager": ["Purchase Manager", "STORE_MANAGER (no dedicated purchase role exists)"],
  "08-sales-manager": ["Sales Manager", "MERCHANDISER (no dedicated sales role exists)"],
  "09-accountant": ["Accountant", "ACCOUNTS_MANAGER, ACCOUNTS_EXECUTIVE"],
  "10-hr-manager": ["HR Manager", "MANAGEMENT, SUPER_ADMIN, HRMS team approvers (no HR role exists)"],
  "11-dispatch-manager": ["Dispatch Manager", "DISPATCH_MANAGER, WAREHOUSE_USER"],
  "12-company-admin": ["Company Admin", "SUPER_ADMIN; MANAGEMENT (view/approve)"],
  "13-company-owner": ["Company Owner", "SUPER_ADMIN / MANAGEMENT / users with financial reports (no Owner role exists)"],
  "14-shared-components": ["Shared Components", "Used by all screens"],
};
const KIND = { E: "EXISTING (via mobile auth adapter)", N: "NEW thin mobile route (designed in docs/05)", G: "BACKEND_GAP — APPROVAL_REQUIRED" };
const STD_STATES = {
  Loading: "Skeleton cards (SHR-003) while data loads; header and bottom nav stay visible.",
  Empty: "EmptyState with a one-line explanation and, where allowed, the main action.",
  Error: "ErrorState with the server's `message` (from the existing error envelope) and Retry. Codes are never shown.",
  Offline: "OfflineBanner at the top; cached read-only data if any; submits are disabled (no offline queue).",
  "Permission denied": "PermissionDeniedState when the server returns PERMISSION_DENIED / NOT_FOUND for out-of-scope data, or MODULE_NOT_ENABLED (SHR-004).",
  "Session expired": "Single refresh attempt; on failure → AUTH-007.",
  Success: "Toast or result screen using the server's success message.",
};
const md = (t) => String(t).replace(/\|/g, "\\|");
const list = (a) => (a && a.length ? a.map((x) => `- ${x}`).join("\n") : "- —");
const write = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c.trimStart() + "\n"); };

const screens = loadScreens();
const byCat = {};
for (const s of screens) (byCat[s.cat] = byCat[s.cat] || []).push(s);

// ---- per-screen files ----
for (const s of screens) {
  const dir = path.join(DESIGN, "screens", s.cat, folderOf(s));
  const designed = !!s.render;
  write(path.join(dir, "screen-spec.md"), `
# ${s.id} — ${s.title}

| Field | Value |
|---|---|
| Category | ${CATS[s.cat][0]} (\`${s.cat}\`) |
| Status | **${s.status}** (batch ${s.batch}) |
| Design version | ${VERSION} |
| Mockup | ${designed ? "[screen.png](screen.png)" : "not designed yet (batch 2)"} |
| Prototype | \`design/prototypes/index.html?screen=${s.id}\` |
| Required permission | \`${md(s.perm)}\` |

## Purpose
${s.purpose || "—"}

## User types / ERP roles
${list(s.roles)}

## Header and navigation
${designed ? "Uses the shared `AppHeader` (home) or inner header (back + title); bottom navigation per `design/design-system/NAVIGATION.md` (hidden on forms and full-screen flows)." : "To be designed."}

## Data / API
| Endpoint | Kind |
|---|---|
${(s.api || []).map(([p, k]) => `| \`${md(p)}\` | ${KIND[k]} |`).join("\n")}

## Available actions
${list(s.actions)}

## Validation
${list(s.validation)}

## Navigation destinations
${list(s.nav)}

## UI components
Shared components only (see \`design/design-system/COMPONENTS.md\`). Demo data in the mockup is marked "DEMO DATA".
`);
  write(path.join(dir, "interactions.md"), `
# ${s.id} — interactions

${(s.actions && s.actions.length ? s.actions : ["No user actions"]).map((a) => `- **${a}** — buttons for an action are shown only when the user holds its permission; the server re-checks every call.`).join("\n")}

Navigation: ${(s.nav && s.nav.length ? s.nav.join(", ") : "—")}.
Double-submit protection: primary actions show loading and are disabled until the server answers.
`);
  write(path.join(dir, "states.md"), `
# ${s.id} — states

| State | Behaviour |
|---|---|
${Object.entries(STD_STATES).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

Screen-specific: ${s.purpose || "—"}
`);
}

// ---- category READMEs ----
for (const [cat, items] of Object.entries(byCat)) {
  write(path.join(DESIGN, "screens", cat, "README.md"), `
# ${CATS[cat][0]}

Who: ${CATS[cat][1]}. Categories are design scenarios — visibility is always decided by permission keys, never by role names.

| Screen | Title | Status | Permission | Mockup |
|---|---|---|---|---|
${items.map((s) => `| ${s.id} | [${s.title}](${folderOf(s)}/screen-spec.md) | ${s.status} | \`${md(s.perm)}\` | ${s.render ? `[png](${folderOf(s)}/screen.png)` : "—"} |`).join("\n")}
`);
}

// ---- inventory documents ----
const total = screens.length, designed = screens.filter((s) => s.render).length;
const gaps = screens.filter((s) => (s.api || []).some(([, k]) => k === "G"));
write(path.join(DESIGN, "screen-inventory", "ALL_SCREENS.md"), `
# All screens (${VERSION})

Generated from \`design/prototypes/screens-*.js\` by \`design/tools/generate-docs.cjs\` — do not edit by hand.

**${total} screens** · **${designed} designed (batch 1, READY_FOR_REVIEW)** · **${total - designed} pending (batch 2, NOT_STARTED)** · ${gaps.length} screens touch a BACKEND_GAP.

${Object.entries(byCat).map(([cat, items]) => `## ${CATS[cat][0]} (${items.filter((s) => s.render).length}/${items.length})

| ID | Screen | Status | Batch |
|---|---|---|---|
${items.map((s) => `| ${s.id} | ${s.title} | ${s.status} | ${s.batch} |`).join("\n")}`).join("\n\n")}
`);
write(path.join(DESIGN, "screen-inventory", "SCREEN_PERMISSION_MAPPING.md"), `
# Screen → permission mapping (${VERSION})

Permission keys are \`module.action\` from \`fashion-erp/src/config/rbac.ts\`. A screen is shown when the user holds the key **and** the company entitlement is on (\`module-entitlements.ts\`). Roles are listed only as examples of who holds the key by default — roles are per company and customizable, and per-user GRANT/DENY overrides exist, so the app must use the keys from \`GET /api/mobile/v1/me\` (gap G-01), never role names.

| Screen | Title | Required permission | Default roles holding it |
|---|---|---|---|
${screens.map((s) => `| ${s.id} | ${md(s.title)} | \`${md(s.perm)}\` | ${md((s.roles || []).join("; "))} |`).join("\n")}
`);
write(path.join(DESIGN, "screen-inventory", "API_SCREEN_MAPPING.md"), `
# Screen → API mapping (${VERSION})

Kinds: **E** existing ERP route reused through the mobile bearer adapter · **N** new thin mobile route already designed in \`docs/05_API_CONTRACT.md\` · **G** \`BACKEND_GAP — APPROVAL_REQUIRED\` (no fake responses will be built in its place).

| Screen | Endpoint | Kind |
|---|---|---|
${screens.flatMap((s) => (s.api || []).map(([p, k]) => `| ${s.id} | \`${md(p)}\` | ${k}${k === "G" ? " — **BACKEND_GAP — APPROVAL_REQUIRED**" : ""} |`)).join("\n")}

## Screens with a backend gap
${gaps.map((s) => `- ${s.id} ${s.title}: ${(s.api || []).filter(([, k]) => k === "G").map(([p]) => p).join("; ")}`).join("\n")}
`);
write(path.join(DESIGN, "screen-inventory", "SCREEN_APPROVAL_STATUS.md"), `
# Screen approval status (${VERSION})

Statuses: NOT_STARTED → DESIGN_IN_PROGRESS → READY_FOR_REVIEW → CHANGES_REQUESTED → APPROVED → IMPLEMENTED → VERIFIED.
Only the user can set APPROVED (record it in \`design/approvals/APPROVED_SCREENS.md\`).

| Screen | Title | Status | Batch | Approved by / date |
|---|---|---|---|---|
${screens.map((s) => `| ${s.id} | ${md(s.title)} | ${s.status} | ${s.batch} | — |`).join("\n")}
`);
console.log(`Docs generated: ${total} screens (${designed} designed, ${total - designed} pending), ${gaps.length} with gaps`);
