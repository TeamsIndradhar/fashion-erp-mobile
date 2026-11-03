// Loads the prototype screen registry in Node (no dependencies). Used by export-png.cjs and generate-docs.cjs.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const PROTO = path.join(__dirname, "..", "prototypes");
const FILES = ["components.js", "screens-auth-employee.js", "screens-work.js", "screens-mgmt.js", "screens-batch2.js"];

function loadScreens() {
  globalThis.SCREENS = [];
  delete globalThis.REG;
  for (const f of FILES) vm.runInThisContext(fs.readFileSync(path.join(PROTO, f), "utf8"), { filename: f });
  const list = globalThis.SCREENS.map((s) => ({ status: s.render ? "READY_FOR_REVIEW" : "NOT_STARTED", batch: s.render ? 1 : 2, ...s }));
  const ids = new Set();
  for (const s of list) {
    if (ids.has(s.id)) throw new Error("Duplicate screen id " + s.id);
    ids.add(s.id);
  }
  return list.sort((a, b) => a.cat.localeCompare(b.cat) || a.id.localeCompare(b.id, undefined, { numeric: true }));
}

module.exports = { loadScreens, PROTO };

// Folder name for a screen: "<ID>-<slug>", e.g. "EMP-001-employee-home".
function folderOf(s) {
  return `${s.id}-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48)}`;
}
module.exports.folderOf = folderOf;
