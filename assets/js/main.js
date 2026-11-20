(() => {
  "use strict";
  const CFG = window.SITE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- header */
  const header = $(".site-header");
  const hero = $(".hero");
  const onScroll = () => {
    const limit = hero ? hero.offsetHeight - 90 : 40;
    header.classList.toggle("is-solid", window.scrollY > Math.min(limit, 60));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------- mobile menu */
  const menuBtn = $(".menu-btn");
  const menu = $("#mobile-menu");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    $(".menu-btn__txt", menuBtn).textContent = open ? "Zatvori" : "Meni";
    header.classList.toggle("menu-open", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
    window.__lenis?.[open ? "stop" : "start"]();
    if (open) setTimeout(() => $("a", menu)?.focus(), 250);
  };
  if (menu) menu.inert = true;
  menuBtn?.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  menu?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu?.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia("(min-width: 1025px)").addEventListener?.("change", (m) => { if (m.matches) setMenu(false); });

  /* ---------------------------------------------------------- reveals (below the fold only) */
  if (!window.__fx && !reduceMotion && "IntersectionObserver" in window) {
    const items = $$(".rv, .rv-img").filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.9);
    if (items.length) {
      document.documentElement.classList.add("js-reveal");
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      $$(".rv, .rv-img").forEach((el) => (items.includes(el) ? io.observe(el) : el.classList.add("in")));
    }
  }

  /* ---------------------------------------------------------- signature parallax */
  const sig = $(".signature"), sigMedia = $(".signature__media");
  if (sig && sigMedia && !reduceMotion && !window.__fx) {
    let ticking = false;
    const update = () => {
      const r = sig.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) {
        const p = (r.top + r.height / 2 - vh / 2) / (vh + r.height); // -0.5..0.5
        sigMedia.style.transform = `translate3d(0, ${(p * -14).toFixed(2)}%, 0)`;
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------- services → prefilled form */
  const typeSelect = $("#f-type");
  $$("[data-prefill]").forEach((a) => a.addEventListener("click", () => {
    if (!typeSelect) return;
    typeSelect.value = a.dataset.prefill;
    const f = typeSelect.closest(".field");
    f.classList.remove("is-flash"); void f.offsetWidth; f.classList.add("is-flash");
    clearError(typeSelect);
    setTimeout(() => typeSelect.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  }));

  /* ---------------------------------------------------------- gallery filter */
  const gItems = $$(".g-item");
  const filterBtns = $$(".filters button");
  const counts = gItems.reduce((acc, it) => { acc[it.dataset.cat] = (acc[it.dataset.cat] || 0) + 1; return acc; }, {});
  filterBtns.forEach((b) => {
    const n = b.dataset.filter === "sve" ? gItems.length : (counts[b.dataset.filter] || 0);
    const sup = $("sup", b); if (sup) sup.textContent = String(n).padStart(2, "0");
    b.addEventListener("click", () => {
      filterBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const f = b.dataset.filter;
      let shown = 0;
      gItems.forEach((it) => {
        const show = f === "sve" || it.dataset.cat === f;
        it.hidden = !show;
        if (show) { shown++; it.classList.remove("is-entering"); void it.offsetWidth; if (!reduceMotion) it.classList.add("is-entering"); }
      });
      $("#g-live").textContent = `Prikazano: ${shown}`;
      $(".g-empty").hidden = shown !== 0;
      window.ScrollTrigger?.refresh();
    });
  });

  /* ---------------------------------------------------------- lightbox */
  const lb = $("#lightbox");
  const lbImg = $("img", lb), lbCap = $(".lb__cap", lb), lbCount = $(".lb__count", lb), lbCat = $(".lb__cat", lb);
  let lbList = [], lbIdx = 0, lbReturn = null;
  const visibleItems = () => gItems.filter((it) => !it.hidden);
  const show = (i, swap) => {
    lbIdx = (i + lbList.length) % lbList.length;
    const it = lbList[lbIdx], img = $("img", it);
    const set = () => {
      lbImg.src = img.dataset.full || img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = it.dataset.title;
      lbCat.textContent = it.dataset.catLabel;
      lbCount.textContent = `${String(lbIdx + 1).padStart(2, "0")} / ${String(lbList.length).padStart(2, "0")}`;
      lbImg.classList.remove("is-swap");
    };
    if (swap && !reduceMotion) { lbImg.classList.add("is-swap"); setTimeout(set, 220); } else set();
  };
  const openLb = (item) => {
    lbList = visibleItems(); lbReturn = document.activeElement;
    show(lbList.indexOf(item));
    lb.hidden = false; lb.inert = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    $(".lb__close", lb).focus();
  };
  const closeLb = () => {
    lb.classList.remove("is-open"); lb.inert = true;
    document.documentElement.style.overflow = "";
    window.__lenis?.start();
    setTimeout(() => { lb.hidden = true; }, reduceMotion ? 0 : 450);
    lbReturn?.focus();
  };
  gItems.forEach((it) => $("button", it).addEventListener("click", () => openLb(it)));
  $(".lb__close", lb).addEventListener("click", closeLb);
  $(".lb__prev", lb).addEventListener("click", () => show(lbIdx - 1, true));
  $(".lb__next", lb).addEventListener("click", () => show(lbIdx + 1, true));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb__stage")) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowRight") show(lbIdx + 1, true);
    else if (e.key === "ArrowLeft") show(lbIdx - 1, true);
    else if (e.key === "Tab") { // focus trap
      const f = $$("button", lb); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let tx = null; // swipe
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(lbIdx + (dx < 0 ? 1 : -1), true);
  });

  /* ---------------------------------------------------------- contact details from config */
  const details = $("#contact-details");
  const rows = [];
  if (CFG.phone) rows.push(["Telefon", CFG.phone, "tel:" + CFG.phone.replace(/[^+\d]/g, "")]);
  if (CFG.email) rows.push(["E-mail", CFG.email, "mailto:" + CFG.email]);
  if (CFG.instagram) rows.push(["Instagram", CFG.instagram.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), CFG.instagram]);
  [...rows].reverse().forEach(([k, v, href]) => {
    const d = document.createElement("div");
    d.innerHTML = `<dt>${k}</dt><dd><a class="u-link" href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}></a></dd>`;
    $("a", d).textContent = v;
    if (k !== "Instagram") {
      const b = document.createElement("button"); b.type = "button"; b.className = "copy-btn"; b.textContent = "Kopiraj";
      b.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(v); b.textContent = "Kopirano"; }
        catch { const r = document.createRange(); r.selectNodeContents($("a", d)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Označeno"; }
        setTimeout(() => (b.textContent = "Kopiraj"), 2000);
      });
      $("dd", d).append(b);
    }
    details.insertBefore(d, details.firstChild);
  });
  // footer
  const fc = $("#footer-contact");
  rows.forEach(([k, v, href]) => {
    const li = document.createElement("li"); const a = document.createElement("a");
    a.className = "u-link"; a.href = href; a.textContent = v;
    if (href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    li.append(a); fc.append(li);
  });
  if (CFG.privacyPolicyUrl) {
    const p = $("#privacy-link"); p.href = CFG.privacyPolicyUrl; p.hidden = false;
    const c = $("#consent-privacy"); c.href = CFG.privacyPolicyUrl; c.hidden = false;
  }
  if (CFG.phone) {
    const tel = "tel:" + CFG.phone.replace(/[^+\d]/g, "");
    document.querySelectorAll("[data-phone]").forEach((el) => { el.hidden = false; el.href = tel; const t = el.querySelector("[data-phone-text]"); if (t) t.textContent = CFG.phone; });
  }
  /* mobile: services carousel counter */
  const svcGrid = $(".svc-grid"), prog = $(".svc-progress");
  if (svcGrid && prog) {
    const cards = $$(".svc", svcGrid), num = $(".svc-progress__num", prog), bar = $(".svc-progress__bar i", prog);
    const upd = () => {
      if (svcGrid.scrollWidth <= svcGrid.clientWidth + 2) return;
      const max = svcGrid.scrollWidth - svcGrid.clientWidth;
      const p = Math.min(1, Math.max(0, svcGrid.scrollLeft / max));
      const i = Math.round(p * (cards.length - 1));
      num.textContent = String(i + 1).padStart(2, "0");
      bar.style.transform = `scaleX(${(i + 1) / cards.length})`;
    };
    svcGrid.addEventListener("scroll", () => requestAnimationFrame(upd), { passive: true });
    upd();
  }

  /* mobile: quick-contact bar, shown between the hero and the contact section */
  const mbar = $("#mbar");
  if (mbar && "IntersectionObserver" in window) {
    mbar.hidden = false;
    let pastHero = false, nearEnd = false;
    const sync = () => mbar.classList.toggle("is-on", pastHero && !nearEnd && !document.documentElement.style.overflow);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); }).observe($(".hero"));
    const endIO = new IntersectionObserver((es) => { nearEnd = es.some((x) => x.isIntersecting); sync(); }, { rootMargin: "0px 0px -10% 0px" });
    [$("#kontakt"), $(".footer")].forEach((el) => el && endIO.observe(el));
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
  }
  $("#year").textContent = new Date().getFullYear();
  $(".to-top")?.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); $(".wordmark")?.focus({ preventScroll: true }); });

  /* ---------------------------------------------------------- form */
  const form = $("#inquiry");
  if (!form) return;
  const status = $("#form-status");
  const submit = $("button[type=submit]", form);
  const started = Date.now();
  const configured = Boolean(CFG.formEndpoint);
  $("#config-note").hidden = configured;
  if (!CFG.acceptsFiles) $("#file-field").hidden = true;

  const messages = {
    name: { valueMissing: "Upišite ime i prezime.", tooShort: "Ime i prezime treba da ima bar 3 znaka." },
    phone: { valueMissing: "Upišite broj telefona kako bismo mogli da vas pozovemo.", patternMismatch: "Proverite broj — dozvoljene su cifre, razmaci i znak +." },
    email: { valueMissing: "Upišite e-mail adresu.", typeMismatch: "E-mail adresa nije ispravna, na primer: ime@primer.rs." },
    type: { valueMissing: "Izaberite vrstu nameštaja." },
    message: { valueMissing: "Opišite ukratko šta vam je potrebno.", tooShort: "Dodajte još nekoliko reči o ideji (bar 10 znakova)." }
  };
  function errEl(input) { return $(`#${input.id}-err`); }
  function clearError(input) {
    const f = input.closest(".field"); f?.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid"); const e = errEl(input); if (e) e.textContent = "";
  }
  function check(input) {
    const v = input.validity; if (v.valid) { clearError(input); return true; }
    const m = messages[input.name] || {};
    const key = Object.keys(m).find((k) => v[k]);
    input.closest(".field").classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    errEl(input).textContent = key ? m[key] : "Proverite ovo polje.";
    return false;
  }
  const fields = $$("input, select, textarea", form).filter((el) => el.id && errEl(el));
  fields.forEach((el) => {
    el.addEventListener("blur", () => { if (el.value) check(el); });
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("is-invalid")) check(el); });
  });

  // files
  const fileInput = $("#f-files"), fileList = $("#f-files-list"), drop = $(".file");
  const MAX_FILES = 3, MAX_MB = 10;
  let files = [];
  const renderFiles = () => {
    fileList.textContent = files.length ? files.map((f) => `${f.name} (${(f.size / 1048576).toFixed(1)} MB)`).join(", ") : "JPG, PNG, HEIC ili PDF · do 3 fajla, najviše 10 MB po fajlu";
  };
  const addFiles = (list) => {
    const err = $("#f-files-err"); err.textContent = "";
    for (const f of list) {
      if (files.length >= MAX_FILES) { err.textContent = `Možete priložiti najviše ${MAX_FILES} fajla.`; break; }
      if (f.size > MAX_MB * 1048576) { err.textContent = `„${f.name}“ je veći od ${MAX_MB} MB.`; continue; }
      if (!/^(image\/|application\/pdf)/.test(f.type) && !/\.(heic|heif)$/i.test(f.name)) { err.textContent = `„${f.name}“ nije slika ni PDF.`; continue; }
      files.push(f);
    }
    renderFiles();
  };
  fileInput?.addEventListener("change", () => { addFiles(fileInput.files); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach((t) => drop?.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("is-drag"); }));
  ["dragleave", "drop"].forEach((t) => drop?.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("is-drag"); }));
  drop?.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
  $("#f-files-clear")?.addEventListener("click", () => { files = []; renderFiles(); $("#f-files-err").textContent = ""; });
  renderFiles();

  const setStatus = (kind, title, text) => {
    status.hidden = false;
    status.className = `status status--${kind}`;
    status.innerHTML = "";
    const s = document.createElement("strong"); s.textContent = title; status.append(s);
    if (text) status.append(document.createTextNode(text));
    status.focus();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.hidden = true;
    const ok = fields.map(check).every(Boolean);
    if (!ok) {
      const first = fields.find((f) => f.getAttribute("aria-invalid") === "true");
      first?.focus();
      setStatus("err", "Upit nije poslat.", " Proverite označena polja i pokušajte ponovo.");
      first?.focus();
      return;
    }
    // spam: honeypot + minimum fill time
    if ($("#f-website").value || Date.now() - started < 3000) {
      setStatus("err", "Upit nije poslat.", " Sačekajte trenutak i pokušajte ponovo.");
      return;
    }
    if (!configured) {
      setStatus("info", "Slanje putem sajta još nije aktivirano.",
        " Vaši podaci nisu poslati niti sačuvani." + (CFG.phone ? ` Do tada nas pozovite na ${CFG.phone}.` : " Prijem upita biće uključen pre zvaničnog pokretanja sajta."));
      return;
    }
    const data = new FormData(form);
    data.delete("files");
    data.delete("website");
    files.forEach((f) => data.append("files", f, f.name));
    data.append("_subject", `Novi upit — ${data.get("type") || "nameštaj po meri"}`);
    submit.setAttribute("aria-busy", "true");
    $(".btn__txt", submit).textContent = "Šaljem…";
    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 30000);
      const res = await fetch(CFG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" }, signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(String(res.status));
      form.reset(); files = []; renderFiles();
      setStatus("ok", "Hvala, vaš upit je primljen.", " Javićemo vam se da zajedno definišemo sledeće korake.");
    } catch (err) {
      setStatus("err", "Upit nije poslat.", " Došlo je do greške u vezi. Proverite internet konekciju i pokušajte ponovo. Vaš unos je sačuvan u obrascu.");
    } finally {
      submit.removeAttribute("aria-busy");
      $(".btn__txt", submit).textContent = "Pošaljite upit";
    }
  });
})();
