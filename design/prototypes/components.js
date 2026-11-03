/* Fashion ERP Mobile — prototype components (Design System v1.0).
   Every screen uses only these helpers so the look stays consistent.
   Prototype only: static HTML, demo data, no API calls. */
(function (g) {
  const P = {
    home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    bell: "M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
    calendar: "M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2",
    chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
    trend: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
    edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
    pin: "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
    gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.2V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 3.1V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    login: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
    check: "M20 6 9 17l-5-5",
    checkc: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM8 12l3 3 5-6",
    x: "M18 6 6 18M6 6l12 12",
    xc: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM15 9l-6 6M9 9l6 6",
    alert: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
    lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
    eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
    eyeoff: "M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2",
    clock: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM12 7v5l3 2",
    finger: "M12 11v3a8 8 0 0 1-1 4M8 13a4 4 0 0 1 8 0v1M5 12a7 7 0 0 1 14 0v2M16 17a12 12 0 0 1-.7 3M8.5 19.5A10 10 0 0 0 9 15M4 8a9 9 0 0 1 16 0",
    camera: "M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
    rupee: "M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5",
    box: "M21 8 12 3 3 8l9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8",
    truck: "M1 4h14v12H1zM15 9h4l4 4v3h-8M5.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    factory: "M2 20h20M4 20V10l5 3v-3l5 3V6h6v14M8 16h2M14 16h2",
    clipboard: "M9 2h6v4H9zM16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h4",
    search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
    chev: "M9 18l6-6-6-6",
    back: "M15 18l-6-6 6-6",
    help: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01",
    info: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM12 16v-4M12 8h.01",
    headset: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    wifioff: "M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.3-1.7M2 8.8a15 15 0 0 1 4.2-2.7M22 8.8A15 15 0 0 0 11 4M12 20h.01",
    layers: "M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    cart: "M6 6h15l-1.5 9h-12zM6 6 5 3H2M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
    brief: "M3 7h18v13H3zM8 7V4h8v3M3 13h18",
    scan: "M3 7V3h4M17 3h4v4M21 17v4h-4M7 21H3v-4M7 12h10",
    phone: "M7 2h10v20H7zM11 18h2",
    refresh: "M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5",
    key: "M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4",
    filter: "M22 3H2l8 9.5V19l4 2v-8.5z",
    plus: "M12 5v14M5 12h14",
    hand: "M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4L2.4 16a2 2 0 0 1 2.8-2.8L7 15",
    award: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.2 13.9 7 23l5-3 5 3-1.2-9.1",
    building: "M3 21h18M5 21V5l7-3 7 3v16M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1",
    mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
    play: "M8 5v14l11-7z",
    sparkle: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8",
  };
  const COLOR = { primary: "#4130cc", success: "#0b973d", danger: "#e02130", warning: "#f08c00", info: "#2f6fed", purple: "#7c5cf2", text: "#07082a", muted: "#8789a8", white: "#fff" };
  const TINT = { primary: "#ece9fd", success: "#dff8e9", danger: "#fde8ea", warning: "#fff1d9", info: "#e3edfe", purple: "#efe9ff", muted: "#efedf8" };

  function icon(name, color = "text", size = 22, sw = 2) {
    const c = COLOR[color] || color;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${P[name] || P.info}"/></svg>`;
  }
  const tileIcon = (name, tone = "primary", size = 40) =>
    `<div class="it" style="background:${TINT[tone] || TINT.primary};width:${size}px;height:${size}px">${icon(name, tone, size * 0.55)}</div>`;
  const logo = () => `<svg class="logo" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 12a3.5 3.5 0 1 1 3.5 3.5c-1.8.8-3.5 1.8-3.5 3.8M24 19.3 5 32.5c-1.6 1.1-.8 3.5 1.1 3.5h35.8c1.9 0 2.7-2.4 1.1-3.5z"/></svg>`;

  const C = {
    icon, tileIcon,
    status: (t = "9:41") => `<div class="statusbar"><span>${t}</span><span class="sys"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#07082a"/><rect x="5" y="5" width="3" height="7" rx="1" fill="#07082a"/><rect x="10" y="2.5" width="3" height="9.5" rx="1" fill="#07082a"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#07082a"/></svg><svg width="18" height="13" viewBox="0 0 18 13"><path d="M1 9a12 12 0 0 1 16 0M4 11.5a8 8 0 0 1 10 0" stroke="#07082a" stroke-width="2" fill="none" stroke-linecap="round"/></svg><svg width="26" height="13" viewBox="0 0 26 13"><rect x="1" y="1" width="21" height="11" rx="3" stroke="#07082a" stroke-width="1.5" fill="none"/><rect x="3" y="3" width="17" height="7" rx="1.5" fill="#07082a"/><rect x="23" y="4.5" width="2" height="4" rx="1" fill="#07082a"/></svg></span></div>`,
    demo: () => `<div class="demo">DEMO DATA</div>`,
    header: ({ sub = "Attendance Mobile", unread = 0, settings = false } = {}) =>
      `<div class="hdr">${logo()}<div class="ttl"><b>Fashion ERP</b><span>${sub}</span></div><div class="ib">${icon("bell", "text", 24)}${unread ? `<span class="badge-n">${unread}</span>` : ""}</div>${settings ? `<div class="ib">${icon("gear", "text", 24)}</div>` : ""}</div>`,
    inner: (title, { right = "", sub = "" } = {}) =>
      `<div class="hdr inner"><div class="ib">${icon("back", "text", 24)}</div><div class="ttl"><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</div>${right}</div>`,
    company: (name = "Indradhar Fashions Pvt Ltd") => `<div class="company">${icon("building", "primary", 14)}${name}</div>`,
    profile: ({ name = "Rohit Kumar", id = "EMP00123", dept = "Production Dept.", desig = "", status = "Active", tone = "success", initials = "RK" } = {}) =>
      `<div class="card prof"><div class="avatar">${initials}<span class="on"></span></div><div class="who"><b>${name}</b><span>${id}</span><span>${dept}${desig ? " · " + desig : ""}</span></div>${status ? C.pill(status, tone) : ""}</div>`,
    pill: (text, tone = "neutral") => `<span class="pill ${tone}"><span class="d"></span>${text}</span>`,
    sech: (title, link = "", ic = "") => `<div class="sech"><b>${ic ? icon(ic, "primary", 22) : ""}${title}</b>${link ? `<a>${link} ${icon("chev", "primary", 16)}</a>` : ""}</div>`,
    grid: (items) => `<div class="grid4">${items.map(([label, ic, tone, cnt]) => `<div class="tile">${cnt ? `<span class="cnt">${cnt}</span>` : ""}${tileIcon(ic, tone)}${label}</div>`).join("")}</div>`,
    banner: (tone, title, text = "", right = "") =>
      `<div class="banner ${tone}">${icon(tone === "success" ? "shield" : tone === "danger" ? "xc" : tone === "warning" ? "alert" : "info", tone === "warning" ? "warning" : tone, 26)}<div class="t"><b>${title}</b>${text}</div>${right}</div>`,
    nav: (active = "Home", tabs = ["Home", "My Work", "Modules", "Alerts", "Profile"], badge = { Alerts: 2 }) => {
      const ic = { Home: "home", "My Work": "brief", Reports: "chart", Modules: "grid", Alerts: "bell", Notifications: "bell", Profile: "user", Attendance: "calendar", Approvals: "checkc", Team: "users" };
      return `<div class="nav">${tabs.map((t) => `<div class="${t === active ? "on" : ""}"><div class="nic">${icon(ic[t] || "grid", t === active ? "primary" : "muted", 24)}</div>${badge[t] ? `<span class="nb">${badge[t]}</span>` : ""}${t}</div>`).join("")}</div>`;
    },
    kpis: (items) => `<div class="kpis">${items.map(([label, value, sub = "", trend = "mute", ic = ""]) => `<div class="kpi"><small>${ic ? icon(ic, "primary", 14) : ""}${label}</small><b>${value}</b><i class="${trend}">${sub}</i></div>`).join("")}</div>`,
    li: ({ ic = "file", tone = "primary", title, sub = "", sub2 = "", right = "", pill = "", ptone = "neutral", unread = false, chev = true }) =>
      `<div class="li${unread ? " unread" : ""}">${tileIcon(ic, tone, 38)}<div class="m"><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}${sub2 ? `<span>${sub2}</span>` : ""}</div><div class="r">${right ? `<b>${right}</b>` : ""}${pill ? C.pill(pill, ptone) : ""}</div>${chev ? icon("chev", "muted", 18) : ""}</div>`,
    tabs: (items, on = 0) => `<div class="tabs">${items.map((t, i) => `<span class="${i === on ? "on" : ""}">${t}</span>`).join("")}</div>`,
    search: (ph = "Search") => `<div class="search">${icon("search", "muted", 18)}${ph}<span class="spacer"></span>${icon("filter", "muted", 18)}</div>`,
    fld: (label, value = "", { ph = false, focus = false, err = "", help = "", right = "" } = {}) =>
      `<div class="fld"><label>${label}</label><div class="in${ph ? " ph" : ""}${focus ? " focus" : ""}${err ? " err" : ""}"><span>${value}</span>${right}</div>${err ? `<div class="msg">${err}</div>` : help ? `<div class="help">${help}</div>` : ""}</div>`,
    btn: (label, variant = "primary", ic = "", dis = false) => `<div class="btn ${variant}${dis ? " dis" : ""}">${ic ? icon(ic, variant === "secondary" ? "primary" : "white", 20) : ""}${label}</div>`,
    kv: (rows) => `<div class="card">${rows.map(([k, v]) => `<div class="kv"><span>${k}</span><b>${v}</b></div>`).join("")}</div>`,
    state: (ic, tone, title, text, action = "") => `<div class="state"><div class="big" style="background:${TINT[tone]}">${icon(ic, tone, 38)}</div><b>${title}</b><p>${text}</p>${action}</div>`,
    sheet: (inner) => `<div class="sheet-dim"></div><div class="sheet"><div class="grab"></div>${inner}</div>`,
    dialog: (inner) => `<div class="sheet-dim"></div><div class="dialog">${inner}</div>`,
    steps: (n, of) => `<div class="steps">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</div>`,
    hero: ({ place = "Main Factory", verified = "Verified · 12 s ago", acc = "8 m", time = "09:15 AM", state = "in", date = "Tue, 04 Nov" } = {}) => {
      const ring = state === "in" ? `<div class="ring"><div>${icon("calendar", "white", 26)}<small>Checked In</small><b>${time}</b></div></div>` : state === "out" ? `<div class="ring out"><div>${icon("checkc", "white", 26)}<small>Checked Out</small><b>${time}</b></div></div>` : `<div class="ring out"><div>${icon("clock", "white", 26)}<small>Not checked in</small><b>--:--</b></div></div>`;
      return `<div class="hero"><div class="row"><div style="flex:1"><div class="row">${icon("pin", "#43f45d", 30)}<div class="loc"><b>${place}</b><span>${icon("checkc", "#43f45d", 14)}${verified}</span><span>GPS accuracy: ${acc}</span></div></div><div class="divider"></div><div class="row loc">${icon("clock", "white", 22)}<span style="font-size:14px"><b style="display:inline;font-size:14px">Today:</b>&nbsp;${date}</span></div></div>${ring}</div></div>`;
    },
    heroRound: ({ place = "Main Factory", verified = "Location verified · 12 s ago", label = "Tap to Punch", sub = "In / Out", dim = false } = {}) =>
      `<div class="hero" style="padding-bottom:34px"><div class="row">${icon("pin", "white", 28)}<div class="loc"><span style="font-size:12.5px">You are at</span><b style="font-size:20px">${place}</b><span>${icon("checkc", "#43f45d", 14)}${verified}</span></div></div><div class="roundbtn" style="${dim ? "opacity:.5" : ""}"><div>${icon("finger", "white", 46, 1.8)}<b>${label}</b><small>${sub}</small></div></div></div>`,
    chips: (a = "GPS accuracy: 8 m", b = "Device verified", toneB = "success") =>
      `<div class="chips"><div>${icon("shield", "success", 18)}${a}</div><div>${icon(toneB === "success" ? "checkc" : "alert", toneB, 18)}${b}</div></div>`,
    pair: (state = "in") =>
      `<div class="pair"><div class="bigbtn in${state === "in" ? " dis" : ""}">${icon("login", "white", 30)}<div><b>Punch In</b><small>Start your attendance</small></div></div><div class="bigbtn out${state !== "in" ? " dis" : ""}">${icon("logout", "white", 30)}<div><b>Punch Out</b><small>End your attendance</small></div></div></div>`,
    today: (inT = "09:15 AM", outT = "--:--") =>
      `<div class="card">${C.sech("Today's Attendance", "View details", "calendar")}<div class="today"><div class="c"><div class="ic" style="background:#dff8e9">${icon("login", "success", 20)}</div><div><small>Check In</small><b>${inT}</b></div></div><div class="vline"></div><div class="c"><div class="ic" style="background:#fde8ea">${icon("logout", "danger", 20)}</div><div><small>Check Out</small><b>${outT}</b></div></div></div></div>`,
    secure: (text = "Attendance is securely recorded and protected") =>
      `<div class="banner success">${icon("shield", "success", 30)}<div class="t">${text}</div></div>`,
    skel: (h = 60, mb = 10) => `<div class="skel" style="height:${h}px;margin-bottom:${mb}px"></div>`,
    bars: (vals, hi = -1, labels = []) => `<div class="bar">${vals.map((v, i) => `<i class="${i === hi ? "hi" : ""}" style="height:${v}%"></i>`).join("")}</div>${labels.length ? `<div class="row muted" style="justify-content:space-between;font-size:10.5px;margin-top:4px">${labels.map((l) => `<span>${l}</span>`).join("")}</div>` : ""}`,
  };
  /* Screen frame: status bar + DEMO tag + scroll area + optional bottom nav + overlay. */
  C.frame = (content, { nav = null, overlay = "", bg = "" } = {}) =>
    `${C.status()}${C.demo()}<div class="scroll"${bg ? ` style="background:${bg}"` : ""}>${content}</div>${nav ? C.nav(...nav) : ""}${overlay}`;
  g.C = C;
  g.SCREENS = g.SCREENS || [];
  g.REG = g.REG || ((s) => g.SCREENS.push(s));
})(typeof window !== "undefined" ? window : globalThis);

/* Voice note (CR-001, 2026-11-03): users who can't type record a voice note instead.
   state: idle | rec | done. */
(function (g) {
  const C = g.C;
  const wave = (n = 22, seed = 3) => `<div class="wave">${Array.from({ length: n }, (_, i) => `<i style="height:${6 + ((i * seed * 7) % 16)}px"></i>`).join("")}</div>`;
  C.voice = (state = "idle", { label = "Record voice note", secs = "0:24", hint = "Tap to record · max 2 min" } = {}) => {
    if (state === "rec") return `<div class="voice rec"><div class="mic">${C.icon("mic", "white", 22)}</div><div class="vt"><b>Recording… ${secs}</b>${wave(20, 5)}</div><div class="ib">${C.icon("check", "danger", 24)}</div></div>`;
    if (state === "done") return `<div class="voice done"><div class="mic">${C.icon("play", "white", 22)}</div><div class="vt"><b>Voice note · ${secs}</b>${wave(24, 3)}</div><div class="ib">${C.icon("x", "danger", 20)}</div></div>`;
    return `<div class="voice"><div class="mic">${C.icon("mic", "white", 22)}</div><div class="vt"><b>${label}</b><span>${hint}</span></div></div>`;
  };
  /* Remark field + voice: "type or record". */
  C.remark = (label, value = "", voiceState = "idle", opts = {}) =>
    `${C.fld(label + " (type or record)", value || "Type here…", { ph: !value, ...opts })}<div class="or">— or —</div>${C.voice(voiceState)}`;
})(typeof window !== "undefined" ? window : globalThis);
