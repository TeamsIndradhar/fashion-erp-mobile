/* Prototype viewer. ?screen=ID shows one screen; &bare=1 renders only the phone screen (used for PNG export). */
(function () {
  const DESIGN_VERSION = "Design v1.2 · Batches 1+2 (+CR-001 voice notes) · 2026-11-03";
  const CATS = {
    "01-authentication": "01 · Authentication", "02-common-employee": "02 · Common Employee", "03-production-worker": "03 · Production Worker",
    "04-supervisor": "04 · Supervisor", "05-production-manager": "05 · Production Manager", "06-inventory-manager": "06 · Inventory Manager",
    "07-purchase-manager": "07 · Purchase Manager", "08-sales-manager": "08 · Sales Manager", "09-accountant": "09 · Accountant",
    "10-hr-manager": "10 · HR Manager", "11-dispatch-manager": "11 · Dispatch Manager", "12-company-admin": "12 · Company Admin",
    "13-company-owner": "13 · Company Owner", "14-shared-components": "14 · Shared Components",
  };
  const STATUS_COLOR = { READY_FOR_REVIEW: "#1ca454", NOT_STARTED: "#c6c3dc", APPROVED: "#4130cc", CHANGES_REQUESTED: "#e02130" };
  const KIND = { E: ["EXISTING (via adapter)", "#0b973d"], N: ["NEW mobile route (docs/05)", "#4130cc"], G: ["BACKEND_GAP — APPROVAL_REQUIRED", "#e02130"] };
  const screens = globalThis.SCREENS.map((s) => ({ status: s.render ? "READY_FOR_REVIEW" : "NOT_STARTED", batch: s.render ? 1 : 2, ...s }));
  screens.sort((a, b) => a.cat.localeCompare(b.cat) || a.id.localeCompare(b.id, undefined, { numeric: true }));
  const params = new URLSearchParams(location.search);
  let current = params.get("screen") || screens[0].id;
  const root = document.getElementById("root");
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

  const placeholder = (s) => `${C.status()}${C.demo()}<div class="scroll">${C.inner(s.title)}<div style="height:90px"></div>${C.state("clock", "muted", "Batch 2 — not designed yet", "This screen is in the inventory and will be designed in the next batch after Batch 1 is approved.", "")}</div>`;
  const screenHtml = (s) => (s.render ? s.render() : placeholder(s));

  if (params.get("bare") === "1") {
    const s = screens.find((x) => x.id === current);
    document.body.classList.add("bare");
    if (s && s.h) document.documentElement.style.setProperty("--cap-h", s.h + "px");
    if (params.get("w")) { document.documentElement.style.setProperty("--cap-w", params.get("w") + "px"); if (+params.get("w") <= 370) document.body.classList.add("sm"); }
    if (params.get("h")) document.documentElement.style.setProperty("--cap-h", params.get("h") + "px");
    root.innerHTML = `<div class="screen">${s ? screenHtml(s) : "Unknown screen"}</div>`;
    return;
  }

  function spec(s) {
    const list = (arr) => (arr && arr.length ? `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "<p class='muted'>—</p>");
    return `<h2>${s.id} · ${esc(s.title)}</h2>
      <div style="margin:6px 0 10px"><span class="pill ${s.status === "READY_FOR_REVIEW" ? "success" : "neutral"}">${s.status}</span> <span class="pill neutral">Batch ${s.batch}</span></div>
      <div class="muted">${CATS[s.cat]} · ${DESIGN_VERSION}</div>
      <h3>Purpose</h3><p>${esc(s.purpose || "—")}</p>
      <h3>User types / ERP roles</h3>${list(s.roles)}
      <h3>Required permission</h3><p><code>${esc(s.perm)}</code></p>
      <h3>Data / API</h3><ul>${(s.api || []).map(([p, k]) => `<li><span style="color:${KIND[k][1]};font-weight:700">${k}</span> <code>${esc(p)}</code><br><span class="muted">${KIND[k][0]}</span></li>`).join("")}</ul>
      <h3>Actions</h3>${list(s.actions)}
      <h3>Navigates to</h3>${list(s.nav)}
      ${s.validation ? `<h3>Validation</h3>${list(s.validation)}` : ""}
      <h3>States</h3><p class="muted">Loading (skeleton) · Empty · Error (server message + retry) · Offline banner · Permission denied · Success — see SHR-003. Details in <code>design/screens/${s.cat}/${s.id}-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48)}/states.md</code>.</p>
      <p class="muted" style="margin-top:16px">Prototype for design review only — demo data, no API calls.</p>`;
  }

  function render() {
    const s = screens.find((x) => x.id === current) || screens[0];
    const q = (document.getElementById("q") || {}).value || "";
    const byCat = {};
    screens.filter((x) => !q || (x.id + " " + x.title).toLowerCase().includes(q.toLowerCase())).forEach((x) => (byCat[x.cat] = byCat[x.cat] || []).push(x));
    const done = screens.filter((x) => x.render).length;
    root.innerHTML = `<div class="viewer">
      <aside class="v-side"><h1>Fashion ERP Mobile</h1><div class="ver">${DESIGN_VERSION}<br>${done} designed · ${screens.length - done} pending · ${screens.length} total</div>
        <input id="q" class="v-search" placeholder="Search screens" value="${esc(q)}">
        ${Object.keys(CATS).filter((c) => byCat[c]).map((c) => `<div class="v-cat">${CATS[c]} (${byCat[c].filter((x) => x.render).length}/${byCat[c].length})</div>${byCat[c].map((x) => `<div class="v-item ${x.id === s.id ? "active" : ""}" data-id="${x.id}"><span class="v-dot" style="background:${STATUS_COLOR[x.status]}"></span><span class="id">${x.id}</span>${esc(x.title)}</div>`).join("")}`).join("")}
      </aside>
      <main class="v-stage"><div class="crumb">${CATS[s.cat]} › <b>${s.id}</b> · ${esc(s.title)} · <code>${esc(s.perm)}</code></div>
        <div class="phone"><div class="screen">${screenHtml(s)}</div></div>
        <div class="v-controls"><button id="prev">← Prev</button><button id="next">Next →</button></div></main>
      <aside class="v-spec">${spec(s)}</aside></div>`;
    root.querySelectorAll(".v-item").forEach((el) => (el.onclick = () => go(el.dataset.id)));
    const qi = document.getElementById("q");
    qi.oninput = () => { render(); const n = document.getElementById("q"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
    document.getElementById("prev").onclick = () => step(-1);
    document.getElementById("next").onclick = () => step(1);
  }
  function go(id) { current = id; history.replaceState(null, "", "?screen=" + id); render(); }
  function step(d) { const i = screens.findIndex((x) => x.id === current); go(screens[(i + d + screens.length) % screens.length].id); }
  document.addEventListener("keydown", (e) => { if (e.target.id === "q") return; if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1); if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1); });
  render();
})();
