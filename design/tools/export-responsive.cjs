// Exports key screens at small (360x640) and large (430x932) phone sizes to design/screens/responsive/.
// Usage: node design/tools/export-responsive.cjs
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { pathToFileURL } = require("url");
const { PROTO } = require("./load-screens.cjs");

const KEY = ["AUTH-002", "EMP-001", "EMP-002", "EMP-016", "WRK-001", "WRK-004", "SUP-001", "ADM-001", "OWN-001", "SHR-002"];
const SIZES = [[360, 640], [430, 932]];
const browser = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((b) => fs.existsSync(b));
const out = path.join(__dirname, "..", "screens", "responsive");
fs.mkdirSync(out, { recursive: true });
const base = pathToFileURL(path.join(PROTO, "index.html")).href;
for (const id of KEY) for (const [w, h] of SIZES) {
  execFileSync(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${w},${h}`, "--virtual-time-budget=4000",
    `--screenshot=${path.join(out, `${id}-${w}x${h}.png`)}`, `${base}?screen=${id}&bare=1&w=${w}&h=${h}`], { stdio: "ignore", timeout: 60000 });
  process.stdout.write(`${id}@${w} `);
}
console.log("\ndone");
