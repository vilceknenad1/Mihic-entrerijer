/* Enterijer Mihić — motion layer.
   Runs only when GSAP + ScrollTrigger loaded and the visitor allows motion.
   Otherwise it removes the `fx` classes and main.js keeps the simple CSS reveals,
   so the page is always complete without it. */
(() => {
  "use strict";
  const d = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) { d.classList.remove("fx", "fx-load"); return; }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  window.__fx = true;
  d.classList.add("fx");

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const vh = () => window.innerHeight;
  const EASE = "expo.out";
  gsap.defaults({ ease: EASE });

  /* ------------------------------------------------------------ split text */
  function textNodes(el) {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const out = []; while (w.nextNode()) out.push(w.currentNode); return out;
  }
  // words, each wrapped in a mask (.w > .wi). mask=false → plain .wi spans
  function splitWords(el, mask = true) {
    if (el.dataset.split) return $$(".wi", el);
    el.dataset.split = "1";
    textNodes(el).forEach((n) => {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
        const wi = document.createElement("span"); wi.className = "wi"; wi.textContent = part;
        if (mask) { const w = document.createElement("span"); w.className = "w"; w.append(wi); frag.append(w); }
        else frag.append(wi);
      });
      n.replaceWith(frag);
    });
    return $$(".wi", el);
  }
  // characters, grouped per word so lines still break between words
  function splitChars(el) {
    textNodes(el).forEach((n) => {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
        const hw = document.createElement("span"); hw.className = "hw";
        for (const ch of part) { const c = document.createElement("span"); c.className = "ch"; c.textContent = ch; hw.append(c); }
        frag.append(hw);
      });
      n.replaceWith(frag);
    });
    return $$(".ch", el);
  }
  const below = (el) => el.getBoundingClientRect().top > vh() * 0.92;

  /* ------------------------------------------------------------ smooth scroll */
  let lenis = null;
  if (window.Lenis && fine) {
    lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented) return;
      const id = a.getAttribute("href");
      const target = id.length > 1 && document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      lenis.start();
      lenis.scrollTo(target, { offset: id === "#pocetna" ? 0 : -30, duration: 1.7, easing: (x) => 1 - Math.pow(1 - x, 4) });
      if (id === "#sadrzaj") target.focus?.({ preventScroll: true });
    });
  }

  /* ------------------------------------------------------------ grain + cursor */
  if (fine) {
    const grain = document.createElement("div"); grain.className = "grain"; grain.setAttribute("aria-hidden", "true");
    document.body.append(grain);
  }

  if (fine) {
    d.classList.add("fx-cursor");
    $$(".svc").forEach((el) => (el.dataset.cursor = "Zatražite ponudu"));
    $$(".g-item button").forEach((el) => (el.dataset.cursor = "Uvećaj"));
    const c = document.createElement("div");
    c.className = "cursor"; c.setAttribute("aria-hidden", "true");
    c.innerHTML = '<span class="cursor__dot"></span><span class="cursor__label"></span>';
    document.body.append(c);
    const label = $(".cursor__label", c);
    const xTo = gsap.quickTo(c, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(c, "y", { duration: 0.45, ease: "power3" });
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      xTo(e.clientX); yTo(e.clientY); c.classList.add("is-on");
    }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) { label.textContent = t.dataset.cursor; c.dataset.mode = "label"; }
      else if (e.target.closest("a, button, select, label, .filters button")) c.dataset.mode = "link";
      else if (e.target.closest("input, textarea")) { c.dataset.mode = ""; c.classList.remove("is-on"); }
      else c.dataset.mode = "";
    });
    d.addEventListener("pointerleave", () => c.classList.remove("is-on"));

    // magnetic controls
    $$(".btn, .to-top, .menu-btn, .lb__nav button").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
      const my = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.28);
        my((e.clientY - r.top - r.height / 2) * 0.38);
      });
      el.addEventListener("pointerleave", () => { mx(0); my(0); });
    });
  }

  /* ------------------------------------------------------------ header */
  const header = $(".site-header");
  const bar = document.createElement("span"); bar.className = "site-header__progress"; header.append(bar);
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      gsap.set(bar, { scaleX: self.progress });
      const y = self.scroll();
      header.classList.toggle("is-hidden", self.direction === 1 && y > vh() * 0.9);
    }
  });

  /* ------------------------------------------------------------ hero */
  const h1 = $("#hero-title");
  h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
  $$(".line", h1).forEach((l) => l.setAttribute("aria-hidden", "true"));
  const chars = splitChars(h1);

  const heroIn = gsap.timeline({ paused: true });
  heroIn
    .fromTo(".hero__media", { clipPath: "inset(14% 10% 14% 10%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut" }, 0)
    .fromTo(".hero__media img", { scale: 1.4 }, { scale: 1, duration: 2.6, ease: "expo.out" }, 0)
    .from(chars, { yPercent: 118, rotate: 6, duration: 1.4, stagger: 0.022 }, 0.75)
    .from(".hero__eyebrow", { y: 24, autoAlpha: 0, duration: 1.2 }, 0.9)
    .from(".hero__side > *", { y: 34, autoAlpha: 0, duration: 1.3, stagger: 0.1 }, 1.15)
    .from(".hero__foot", { y: 20, autoAlpha: 0, duration: 1.2 }, 1.4)
    .from(header, { yPercent: -100, autoAlpha: 0, duration: 1.2, clearProps: "transform,opacity,visibility" }, 1.1);

  // scroll-out: image sinks, copy lifts and fades
  gsap.to(".hero__media", { yPercent: 16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__in", { yPercent: -14, autoAlpha: 0.15, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });

  /* ------------------------------------------------------------ loader → hero */
  const loader = $(".loader");
  if (d.classList.contains("fx-load") && loader && window.scrollY < 50) {
    lenis?.stop();
    try { sessionStorage.setItem("em-intro", "1"); } catch (e) {}
    const quick = !fine; // phones: same sequence, about half the time
    gsap.globalTimeline.timeScale(1);
    const num = $(".loader__num", loader), mark = $(".loader__mark", loader);
    const mw = splitWords(mark);
    const count = { v: 0 };
    gsap.timeline({
      onComplete: () => { d.classList.remove("fx-load"); lenis?.start(); }
    }).timeScale(quick ? 1.8 : 1)
      .from(mw, { yPercent: 115, duration: 1.1, stagger: 0.08 }, 0.1)
      .to(".loader__line", { scaleX: 1, duration: 1.5, ease: "power3.inOut" }, 0.2)
      .to(count, { v: 2400, duration: 1.5, ease: "power3.inOut", onUpdate: () => (num.textContent = String(Math.round(count.v)).padStart(4, "0")) }, 0.2)
      .to(".loader__in", { yPercent: -30, autoAlpha: 0, duration: 0.9, ease: "power3.in" }, 1.85)
      .to(loader, { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, 2.15)
      .to(".loader-trail", { yPercent: -100, duration: 1.25, ease: "expo.inOut" }, 2.27)
      .add(() => heroIn.play(), 2.25);
  } else {
    d.classList.remove("fx-load");
    heroIn.play(0.35);
  }

  /* ------------------------------------------------------------ headings: masked word rise */
  $$("main .display:not(#hero-title):not(#sig-title), .footer__statement").forEach((h) => {
    const ws = splitWords(h);
    if (!below(h)) return;
    gsap.from(ws, { yPercent: 115, rotate: 3, duration: 1.4, stagger: 0.06, scrollTrigger: { trigger: h, start: "top 86%" } });
  });

  /* labels draw their rule */
  $$(".label").forEach((l) => {
    if (l.closest(".hero")) return;
    if (!below(l)) return;
    l.classList.add("is-armed");
    ScrollTrigger.create({ trigger: l, start: "top 90%", once: true, onEnter: () => l.classList.add("is-in") });
  });

  /* intro paragraph: words light up as you read */
  const introP = $(".intro__text p");
  if (introP) {
    const ws = splitWords(introP, false);
    gsap.fromTo(ws, { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: introP, start: "top 82%", end: "bottom 50%", scrub: true } });
  }

  /* ------------------------------------------------------------ generic fade-ups */
  const ups = $$(".rv").filter((el) => !el.classList.contains("display") && !el.closest(".signature") && !el.classList.contains("step") && below(el));
  gsap.set(ups, { y: 46, autoAlpha: 0 });
  ScrollTrigger.batch(ups, {
    start: "top 90%",
    onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.3, stagger: 0.1, overwrite: true })
  });

  /* image frames: wipe open + inner parallax */
  $$(".rv-img").forEach((f) => {
    if (!below(f)) return;
    gsap.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: f, start: "top 88%" } });
  });
  $$(".delivery__media img").forEach((img) => {
    const box = img.closest(".frame, .delivery__media");
    const amt = img.closest(".g-item") ? 5 : 8;
    gsap.fromTo(img, { yPercent: -amt, scale: 1.18 }, { yPercent: amt, scale: 1.18, ease: "none", scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true } });
  });


  /* ------------------------------------------------------------ marquee: moves only while you scroll */
  const rows = $$(".marquee__track");
  if (rows[0]) gsap.fromTo(rows[0], { xPercent: 0 }, { xPercent: -28, ease: "none", scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 0.6 } });
  if (rows[1]) gsap.fromTo(rows[1], { xPercent: -36 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 0.6 } });

  /* ------------------------------------------------------------ responsive set pieces */
  const sigTitle = $("#sig-title");
  const sigEm = $("em", sigTitle);
  const sigEmWords = splitWords(sigEm);
  const sigWords = splitWords(sigTitle).filter((w) => !sigEm.contains(w));
  const steps = $$(".step");

  const mm = gsap.matchMedia();
  mm.add("(min-width: 1025px)", () => {
    // signature: window opens to full bleed while the line writes itself
    const sig = gsap.timeline({ scrollTrigger: { trigger: ".signature", start: "top top", end: "+=130%", pin: true, scrub: 1, refreshPriority: 2 } });
    sig.fromTo(".signature__media", { clipPath: "inset(18% 24% 18% 24%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }, 0)
      .fromTo(".signature__media img", { scale: 1.35 }, { scale: 1, ease: "power2.out", duration: 1.1 }, 0)
      .fromTo(sigWords, { yPercent: 115 }, { yPercent: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" }, 0.45)
      .fromTo(sigEmWords, { yPercent: 115 }, { yPercent: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" }, 0.75)
      .fromTo(".signature__foot", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1.05)
      .to({}, { duration: 0.25 });

    // process: pinned; the ruler fills and each step switches on in turn
    const proc = $(".process");
    gsap.set(steps, { opacity: 0.22 });
    const pt = gsap.timeline({
      scrollTrigger: {
        trigger: proc, pin: true, scrub: 1, end: "+=140%", refreshPriority: 1,
        start: () => (proc.offsetHeight > vh() ? "bottom bottom" : "top top"),
        invalidateOnRefresh: true
      }
    });
    pt.fromTo(".steps__progress", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 4 }, 0);
    steps.forEach((s, i) => {
      pt.to(s, { opacity: 1, duration: 0.35, ease: "power1.out", onStart: () => s.classList.add("is-active"), onReverseComplete: () => s.classList.remove("is-active") }, i + 0.05)
        .fromTo($(".step__no", s), { yPercent: 40 }, { yPercent: 0, duration: 0.6, ease: "power2.out" }, i + 0.05);
    });
    pt.to({}, { duration: 0.4 });
    return () => { gsap.set(steps, { clearProps: "opacity" }); steps.forEach((s) => s.classList.remove("is-active")); };
  });
  mm.add("(max-width: 1024px)", () => {
    gsap.fromTo([...sigWords, ...sigEmWords], { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.06, scrollTrigger: { trigger: sigTitle, start: "top 85%" } });
    gsap.fromTo(".signature__media", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".signature", start: "top bottom", end: "bottom top", scrub: true } });
    steps.forEach((s) => gsap.fromTo(s, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, scrollTrigger: { trigger: s, start: "top 88%" } }));
  });

  /* ------------------------------------------------------------ delivery + footer */
  gsap.fromTo(".city", { xPercent: -14 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: ".delivery", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".footer__giant span", { yPercent: 70 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".footer__giant", start: "top bottom", end: "bottom bottom", scrub: true } });

  /* keep measurements honest once fonts and images settle */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
