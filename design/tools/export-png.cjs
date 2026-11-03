// Exports design/screens/<category>/<ID>/screen.png for every designed screen using headless Chrome/Edge.
// Usage: node design/tools/export-png.cjs [SCREEN-ID ...]
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { pathToFileURL } = require("url");
const { loadScreens, PROTO, folderOf } = require("./load-screens.cjs");

const BROWSERS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const browser = BROWSERS.find((b) => fs.existsSync(b));
if (!browser) throw new Error("No Chrome/Edge found");

const only = process.argv.slice(2);
const screens = loadScreens().filter((s) => s.render && (!only.length || only.includes(s.id)));
const base = pathToFileURL(path.join(PROTO, "index.html")).href;
const outRoot = path.join(__dirname, "..", "screens");
let n = 0;
for (const s of screens) {
  const dir = path.join(outRoot, s.cat, folderOf(s));
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, "screen.png");
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
    "--force-device-scale-factor=2", `--window-size=390,${s.h || 844}`, "--virtual-time-budget=4000",
    `--screenshot=${out}`, `${base}?screen=${s.id}&bare=1`,
  ], { stdio: "ignore", timeout: 60000 });
  n++;
  process.stdout.write(`${s.id} `);
}
console.log(`\nExported ${n} PNGs`);
