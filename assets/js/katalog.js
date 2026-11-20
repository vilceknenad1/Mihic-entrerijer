/* Enterijer Mihić — realizacije (port of the original catalogue layout).
   URL: /katalog, /katalog?kategorija=kuhinje, /katalog?model=plakar-hrast … */
(function () {
  'use strict';
  var app = document.querySelector('[data-app]'); if (!app) return;
  var IMG = {
    '01': [1500, 2000, 'Kuhinja po meri sa šankom, bež i tamnijim mat frontovima i zlatnim visilicama'],
    '02': [1170, 1560, 'Elegantna kuhinja po meri, beli sjaj, topli dekor drveta i ostrvo'],
    '03': [1500, 2000, 'Kuhinja po meri, bež i tamniji mat frontovi, skrivena LED rasveta i mermerni zidni panel'],
    '04': [1440, 1920, 'TV polica po meri, topli dekor drveta, mat frontovi i otvorene police sa LED rasvetom'],
    '05': [1440, 1920, 'TV polica po meri, drugi ugao, otvorene police sa LED rasvetom'],
    '06': [1320, 1685, 'Sto-pregrada po meri, beli univer i crna metalna konstrukcija'],
    '07': [1170, 1560, 'Kuhinja po meri, beli sjaj, radna ploča od dekora drveta i crna sudopera'],
    '08': [1080, 1350, 'Klizni plakar od toplog hrasta, otvoren, unutrašnja organizacija polica'],
    '09': [1440, 1440, 'Klizni plakar sa LED osvetljenjem na senzor, otvorene police'],
    '10': [1440, 1920, 'Dva klizna ormara i komoda, uklopljeni u prostor pod kosinom'],
    '11': [1440, 1440, 'Ugrađeni cipelarnik do plafona, otvorena vrata sa policama'],
    '12': [1440, 1920, 'Komoda sa fiokama i klizni ormani pod kosinom u potkrovlju'],
    '13': [1080, 1350, 'Klizni plakar po meri od toplog hrasta, sa velikim ogledalom i crnim ramom'],
    '14': [1440, 1440, 'Klizni plakar po meri, crni aluminijumski ram i ogledalo, zatvoren'],
    '15': [1440, 1920, 'Manja kuhinja po meri, beli frontovi i radna ploča od dekora drveta'],
    '16': [1440, 1920, 'Manja kuhinja po meri sa visokim elementom od dekora drveta uz frižider'],
    '17': [1440, 1920, 'Visoki ormarić za kupatilo, beli sjaj, izrada po meri'],
    '18': [1440, 1920, 'Ormar po meri, tamni dekor drveta, fioke i gornji elementi']
  };
  /* Seed data: only facts from public Instagram captions. Everything else is a placeholder. */
  var PRODUCTS = [
    { slug: 'kuhinja-sank', name: 'Kuhinja sa šankom', cats: ['kuhinje'], catLabel: 'Kuhinje', imgs: [['01', '50% 55%'], ['03', '50% 55%']], caption: 'Bež i tamniji mat frontovi', isNew: true, desc: 'Kuhinja rađena po meri, u kombinaciji bež i tamnijih mat frontova, uz zidni panel, skrivenu LED rasvetu i šank koji vizuelno zaokružuje ceo prostor. Zlatne visilice i letvice na zidu i plafonu daju završni karakter prostoru.', material: 'Bež i tamniji mat frontovi, zidni panel, skrivena LED rasveta, šank.' },
    { slug: 'kuhinja-beli-sjaj', name: 'Kuhinja beli sjaj', cats: ['kuhinje'], catLabel: 'Kuhinje', imgs: [['02', '50% 50%'], ['07', '50% 50%']], caption: 'Beli sjaj i toplo drvo', desc: 'Elegantna i moderna kuhinja po meri: spoj belog sjaja i toplog dekora drveta. Čiste linije, visoki elementi i crne ručice.', material: 'Beli sjaj, topli dekor drveta, crne ručice.' },
    { slug: 'kuhinja-mala', name: 'Kuhinja sa visokim elementom', cats: ['kuhinje'], catLabel: 'Kuhinje', imgs: [['15', '50% 50%'], ['16', '40% 50%']], caption: 'Beli frontovi i dekor drveta', desc: 'Kuhinja po meri sa belim frontovima, radnom pločom od dekora drveta i visokim elementom uz frižider. [[PLACEHOLDER: potvrditi opis sa klijentom — objava na Instagramu nije imala natpis.]]' },
    { slug: 'tv-polica', name: 'TV polica', cats: ['dnevni'], catLabel: 'Dnevni boravak', imgs: [['04', '50% 45%'], ['05', '50% 45%']], caption: 'Ugradna LED rasveta', desc: 'Savremena TV polica rađena po meri: kombinacija toplog dekora drveta i mat frontova, uz crne detalje. Otvorene police sa integrisanim LED osvetljenjem; donji zatvoreni elementi za odlaganje. Dimenzije, boje i raspored prilagođavamo prostoru.', material: 'Topli dekor drveta, mat frontovi, crni detalji, ugradna LED rasveta.' },
    { slug: 'sto-pregrada', name: 'Sto-pregrada', cats: ['dnevni'], catLabel: 'Dnevni boravak', imgs: [['06', '50% 50%']], caption: 'Univer i crni metal', desc: 'Moderan sto sa metalnom konstrukcijom, rađen po meri. Kombinacija belog univera i crnog metala, sa policama za odlaganje i gornjom metalnom konstrukcijom. Idealan kao pregrada između kuhinje i dnevnog boravka.', material: 'Beli univer i crni metal.' },
    { slug: 'plakar-hrast', name: 'Plakar od hrasta', cats: ['plakari'], catLabel: 'Plakari', imgs: [['13', '50% 50%'], ['08', '50% 50%']], caption: 'Klizna vrata i ogledalo', desc: 'Kompletan set za spavaću sobu rađen po meri: klizni plakar od toplog hrasta, sa velikim ogledalom i unutrašnjom organizacijom, plus integrisani radni i kozmetički kutak.', material: 'Topli hrast, crni detalji, ogledalo.' },
    { slug: 'plakar-led', name: 'Plakar sa LED rasvetom', cats: ['plakari'], catLabel: 'Plakari', imgs: [['14', '50% 50%'], ['09', '50% 50%']], caption: 'LED osvetljenje na senzor', desc: 'Klizni plakar rađen po meri: vrata sa velikim ogledalom, crni aluminijumski ram i LED osvetljenje sa senzorom koje se pali pri otvaranju. Police i deo za garderobu na vešanje. Pogodan za spavaće sobe, hodnike ili manje prostore.', material: 'Crni aluminijumski ram, ogledalo, LED osvetljenje na senzor.' },
    { slug: 'potkrovlje', name: 'Ormani pod kosinom', cats: ['plakari'], catLabel: 'Plakari', imgs: [['10', '50% 55%'], ['12', '50% 55%']], caption: 'Dva klizna ormara i komoda', desc: 'Dva klizna ormara i komoda sa fiokama, uklopljeni u potkrovlje. Minimalistički dizajn, čiste linije i beli tonovi.', material: 'Beli frontovi, klizna vrata, komoda sa fiokama.' },
    { slug: 'cipelarnik', name: 'Cipelarnik do plafona', cats: ['odlaganje'], catLabel: 'Odlaganje', imgs: [['11', '50% 50%']], caption: 'Ugrađeni cipelarnik', desc: 'Ugrađeni cipelarnik do plafona: čiste linije, bela boja i skriveni dizajn, za hodnik bez nereda.', material: 'Beli frontovi, ugradnja do plafona.' },
    { slug: 'kupatilo', name: 'Ormarić za kupatilo', cats: ['odlaganje'], catLabel: 'Odlaganje', imgs: [['17', '50% 50%']], caption: 'Po meri i želji', desc: 'Ormarići za kupatila po meri i želji.' },
    { slug: 'ormar-tamni', name: 'Ormar, tamni dekor', cats: ['plakari'], catLabel: 'Plakari', imgs: [['18', '50% 50%']], caption: 'Fioke i gornji elementi', desc: 'Ormar po meri, tamni dekor drveta, sa fiokama i gornjim elementima. [[PLACEHOLDER: potvrditi opis sa klijentom — objava na Instagramu nije imala natpis.]]' }
  ];
  var CATS = [['all', 'Sve'], ['kuhinje', 'Kuhinje'], ['plakari', 'Plakari'], ['dnevni', 'Dnevni boravak'], ['odlaganje', 'Odlaganje']];
  var FABRICS = [['photo', 'Kao na slici', '#E7DCCB'], ['t1', 'Ton 1 · krem', '#EDE4D6'], ['t2', 'Ton 2 · bež', '#D3BFA6'], ['t3', 'Ton 3 · taupe', '#A89482'], ['t4', 'Ton 4 · beli', '#F4F1EA'], ['t5', 'Ton 5 · hrast', '#C4A574']];
  var ARR = '<svg class="arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12L12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.3"></path></svg>';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var find = function (slug) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].slug === slug) return PRODUCTS[i]; return null; };
  function img(k, pos, cls, sizes, eager) {
    var d = IMG[k], w = d[0], ss = [];
    if (w > 640) ss.push('assets/img/' + k + '-640.webp 640w');
    if (w > 1024) ss.push('assets/img/' + k + '-1024.webp 1024w');
    ss.push('assets/img/' + k + '.webp ' + w + 'w');
    return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="assets/img/' + k + '.webp" srcset="' + ss.join(', ') + '" sizes="' + (sizes || '(max-width: 767px) 100vw, 50vw') + '" width="' + w + '" height="' + d[1] + '" alt="' + (cls === 'alt' ? '' : esc(d[2])) + '" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async" style="object-position: ' + pos + '">';
  }

  var params = new URLSearchParams(location.search);
  var S = { cat: params.get('kategorija') || 'all', sort: 'rec', dense: false, slug: params.get('model'), cfg: null, roll: 0, saved: '' };
  function freshCfg(p) {
    var q = new URLSearchParams(location.search), cfg = { part: p && p.parts ? p.parts[0] : '', dim: p && p.dims ? p.dims[0] : 'custom', fabric: 'photo', extras: p && p.extras ? p.extras.slice() : [] };
    if (p && q.get('model') === p.slug) {
      if (q.get('komad') && p.parts && p.parts.indexOf(q.get('komad')) >= 0) cfg.part = q.get('komad');
      var m = q.get('mere'); if (m === 'custom') cfg.dim = 'custom'; else if (p.dims && p.dims.indexOf(Number(m)) >= 0) cfg.dim = Number(m);
      if (q.get('ton') && FABRICS.some(function (f) { return f[0] === q.get('ton'); })) cfg.fabric = q.get('ton');
      if (p.extras && q.has('dodaci')) cfg.extras = q.get('dodaci').split('|').filter(function (x) { return p.extras.indexOf(x) >= 0; });
    }
    return cfg;
  }
  S.cfg = freshCfg(find(S.slug));

  function card(p, i, dense) {
    var a = p.imgs[0], b = p.imgs[1];
    var title = p.name;
    return '<div><a class="card card--p card--low" href="katalog?model=' + p.slug + '" data-open="' + p.slug + '" data-cursor="Pogledaj" style="--d: ' + (i * 60) + 'ms" aria-label="' + esc(p.name) + ', otvori realizaciju">' +
      '<div class="card__bg">' + img(a[0], a[1], '', dense ? '(max-width: 767px) 100vw, 33vw' : '(max-width: 767px) 100vw, 50vw') + (b ? img(b[0], b[1], 'alt') : '') + '</div>' +
      '<div class="card__fa"></div><div class="card__fb"></div><div class="card__c"><span class="card__t">' + esc(p.name) + '</span><span class="card__cap">' + esc(p.caption) + '</span></div></a>' +
      '<div class="pmeta" style="--d: ' + (i * 60) + 'ms"><div><p class="t-sub">' + esc(p.catLabel) + '</p><h2 class="t-h3">' + esc(title) + '</h2>' + (p.isNew ? '<span class="tag">Novo</span>' : '') + '</div>' +
      '<div><p class="price-s">Cena na upit</p><div class="dots" aria-hidden="true"><i style="background:#EDE4D6"></i><i style="background:#D3BFA6"></i><i style="background:#A89482"></i><i style="background:#C9A0A0"></i></div></div></div></div>';
  }
  function chips() {
    return CATS.map(function (c) {
      var n = c[0] === 'all' ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.cats.indexOf(c[0]) >= 0; }).length;
      return '<button class="chip" type="button" data-cat="' + c[0] + '" aria-pressed="' + (S.cat === c[0]) + '">' + c[1] + '<span class="num">' + n + '</span></button>';
    }).join('');
  }
  function seg() { return '<div class="seg" role="group" aria-label="Prikaz"><button type="button" data-view="g" aria-pressed="' + !S.dense + '">Galerija</button><button type="button" data-view="d" aria-pressed="' + S.dense + '">Mreža</button></div>'; }

  function renderList() {
    document.title = 'Realizacije — Enterijer Mihić';
    var list = S.cat === 'all' ? PRODUCTS.slice() : PRODUCTS.filter(function (p) { return p.cats.indexOf(S.cat) >= 0; });
    if (S.sort === 'new') list.sort(function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); });
    var n = list.length, word = n === 1 ? ' rad' : (n >= 2 && n <= 4 ? ' rada' : ' radova');
    app.innerHTML = '<div class="wrap">' +
      '<nav class="crumbs" aria-label="Putanja"><a href="./">Početna</a><span aria-hidden="true">/</span><span>Realizacije</span></nav>' +
      '<div class="ktitle"><h1 class="t-h1">Realizacije</h1><p class="t-lead muted" style="max-width: 30rem">Svaki komad izrađujemo po meri. Boje i materijale birate vi, a ponudu dobijate na upit.</p></div>' +
      '<div class="toolbar"><div class="chips chips--bar" role="group" aria-label="Kategorija">' + chips() + '</div>' +
      '<div class="tools"><button class="chip fbtn" type="button" data-sheet aria-haspopup="dialog">Filteri</button>' +
      '<div class="sel"><label for="k-sort">Sortiraj</label><select id="k-sort" data-sort><option value="rec"' + (S.sort === 'rec' ? ' selected' : '') + '>Preporučeno</option><option value="new"' + (S.sort === 'new' ? ' selected' : '') + '>Najnovije</option><option value="asc" disabled>Cena ↑ (uskoro)</option><option value="desc" disabled>Cena ↓ (uskoro)</option></select></div>' + seg() + '</div></div>' +
      '<p class="vh">' + n + word + '</p>' +
      '<div class="pgrid grid-in' + (S.dense ? ' is-dense' : '') + '">' + list.map(function (p, i) { return card(p, i, S.dense); }).join('') +
      (n ? '' : '<div class="empty"><p class="t-h3">Nema radova u ovoj kategoriji</p><p class="t-body muted" style="max-width: 32rem">Pogledajte sve realizacije ili nam pišite sa idejom za vaš prostor.</p><button class="pill pill--o" type="button" data-cat="all">Prikaži sve radove' + ARR + '</button></div>') +
      '</div><p class="t-body muted" style="margin-top: 4rem; font-size: .875rem">Prikazane slike su fotografije realizovanih radova sa javnog Instagram profila @enterijer_mihic.</p></div>' +
      '<dialog class="sheet" aria-label="Filteri"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem"><p class="t-micro">Filteri</p><button class="iconbtn" type="button" data-sheet-close aria-label="Zatvori filtere"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg></button></div>' +
      '<p class="t-micro muted" style="margin-bottom:.75rem">Kategorija</p><div class="chips">' + chips() + '</div><p class="t-micro muted" style="margin:1.5rem 0 .75rem">Prikaz</p>' + seg() +
      '<button class="pill" type="button" style="width:100%;margin-top:2rem" data-sheet-close>Prikaži ' + n + word + '</button></dialog>';
  }

  function renderProduct(pr) {
    var c = S.cfg;
    document.title = pr.name + ' — Enterijer Mihić';
    var gal = pr.imgs.map(function (im) { var d = IMG[im[0]]; return '<div class="iw" style="aspect-ratio: ' + d[0] + ' / ' + d[1] + '">' + img(im[0], im[1], '', '(max-width: 991px) 100vw, 55vw', true) + '</div>'; });
    if (gal.length < 3) gal.push('<a class="gtile" href="./#kontakt"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M4 7h4l2-2h4l2 2h4v12H4z" fill="none" stroke="currentColor" stroke-width="1.3"></path><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.3"></circle></svg><p class="t-sub">Pogledaj u svom prostoru – pošaljite nam fotografiju sobe</p></a>');
    if (gal.length < 3) gal.push('<div class="gtile gtile--sw"><span class="t-micro">Još fotografija uskoro</span></div>');
    var k = 0, num = function () { k += 1; return (k < 10 ? '0' : '') + k; };
    var fab = FABRICS.filter(function (f) { return f[0] === c.fabric; })[0] || FABRICS[0];
    var dimLabel = c.dim === 'custom' ? 'Druge mere po meri' : c.dim + '×200 cm';
    var W = c.dim === 'custom' ? 0 : c.dim, dw = Math.round(W / 200 * 160);
    var summary = 'Enterijer Mihić upit: ' + pr.name + (pr.parts ? ', ' + c.part : '') + ', ' + dimLabel + ', ' + fab[1] + (pr.extras ? ', dodaci: ' + (c.extras.length ? c.extras.join(', ') : 'bez') : '') + ' — ' + new URL('katalog?' + query(pr), location.href).href;
    var opt = function (label, pressed, attr) { return '<button class="opt num" type="button" ' + attr + ' aria-pressed="' + pressed + '">' + esc(label) + '</button>'; };
    var steps = '';
    if (pr.parts) steps += '<div class="step"><div class="step__h"><span class="step__n num">' + num() + '</span><span class="step__t">Komad</span><span class="step__v">' + esc(c.part) + '</span></div><div class="opts" role="group" aria-label="Komad">' + pr.parts.map(function (p) { return opt(p, c.part === p, 'data-part="' + esc(p) + '"'); }).join('') + '</div></div>';
    steps += '<div class="step"><div class="step__h"><span class="step__n num">' + num() + '</span><span class="step__t">Dimenzije</span><span class="step__v num">' + dimLabel + '</span></div><div class="opts" role="group" aria-label="Dimenzije">' +
      (pr.dims || []).map(function (d) { return opt(d + '×200', c.dim === d, 'data-dim="' + d + '"'); }).join('') + opt(pr.dims ? 'Druge mere po meri' : 'Mere po vašoj želji', c.dim === 'custom', 'data-dim="custom"') + '</div>' +
      (c.dim === 'custom' ? '<p style="font-size:.9375rem;color:#5E4C3E;margin-top:1rem">Pošaljite nam željene mere i fotografiju prostora, a mi vam šaljemo predlog i cenu.</p>' : '') + '</div>';
    steps += '<div class="step"><div class="step__h"><span class="step__n num">' + num() + '</span><span class="step__t">Boja i boja</span><span class="step__v">' + fab[1] + '</span></div><div class="swatches" role="group" aria-label="Boja">' +
      FABRICS.map(function (f) { return '<button class="sw" type="button" data-fab="' + f[0] + '" aria-pressed="' + (c.fabric === f[0]) + '" aria-label="' + f[1] + '" style="background:' + f[2] + '"></button>'; }).join('') +
      '</div><p style="font-size:.8125rem;color:#5E4C3E;margin-top:1rem">Tonovi su orijentacioni. <span class="ph">[[PLACEHOLDER: paleta dekora i materijala]]</span></p></div>';
    if (pr.extras) steps += '<div class="step"><div class="step__h"><span class="step__n num">' + num() + '</span><span class="step__t">Dodaci</span></div><div class="toggles">' + pr.extras.map(function (x) { return '<label class="tog"><input type="checkbox" data-extra="' + esc(x) + '"' + (c.extras.indexOf(x) >= 0 ? ' checked' : '') + '><span>' + esc(x) + '</span><small>cena na upit</small></label>'; }).join('') + '</div></div>';
    steps += '<div class="step"><div class="step__h"><span class="step__n num">' + num() + '</span><span class="step__t">Pregled</span></div><dl class="summary"><dt>Realizacija</dt><dd>' + esc(pr.name) + '</dd>' + (pr.parts ? '<dt>Komad</dt><dd>' + esc(c.part) + '</dd>' : '') + '<dt>Dimenzije</dt><dd class="num">' + dimLabel + '</dd><dt>Boja i materijal</dt><dd>' + fab[1] + '</dd>' + (pr.extras ? '<dt>Dodaci</dt><dd>' + (c.extras.length ? esc(c.extras.join(', ')) : 'Bez dodataka') + '</dd>' : '') + '<dt>Cena</dt><dd>Cena na upit</dd></dl>' +
      (W ? '<svg class="dimsvg" viewBox="0 0 320 220" role="img" aria-label="Skica dimenzija: ' + W + ' × 200 cm"><rect x="60" y="20" width="' + dw + '" height="160" fill="#EADFCF" stroke="currentColor"></rect><rect x="60" y="20" width="' + dw + '" height="26" fill="#C8B39A"></rect><path d="M60 196H' + (60 + dw) + 'M60 191v10M' + (60 + dw) + ' 191v10M44 20V180M39 20h10M39 180h10" stroke="currentColor"></path><text x="' + (60 + dw / 2) + '" y="214" text-anchor="middle" font-size="12" fill="currentColor">' + W + ' cm</text><text x="39" y="104" text-anchor="end" font-size="11" fill="currentColor">200 cm</text></svg>' : '') + '</div>';
    var sim = PRODUCTS.filter(function (x) { return x.slug !== pr.slug && x.cats.some(function (cc) { return pr.cats.indexOf(cc) >= 0; }); });
    sim = sim.concat(PRODUCTS.filter(function (x) { return x.slug !== pr.slug && sim.indexOf(x) < 0; })).slice(0, 3);
    var inquiry = './#kontakt';
    app.innerHTML = '<div class="wrap">' +
      '<nav class="crumbs" aria-label="Putanja"><a href="./">Početna</a><span aria-hidden="true">/</span><a href="katalog" data-list>Realizacije</a><span aria-hidden="true">/</span><span>' + esc(pr.catLabel) + '</span><span aria-hidden="true">/</span><span>' + esc(pr.name) + '</span></nav>' +
      '<div class="pd"><div class="pd__gal" aria-label="Galerija">' + gal.join('') + '</div><div class="pd__panel">' +
      '<p class="t-sub">' + esc(pr.catLabel) + '</p><h1>' + esc(pr.name) + '</h1>' + (pr.placeholderName ? '<p><span class="ph">[[PLACEHOLDER: naziv modela]]</span></p>' : '') +
      '<p class="t-lead pd__desc">' + esc(pr.desc) + '</p>' +
      '<div class="pricebox"><div><p class="t-micro muted">Cena</p><p class="price num"><span style="animation-name:' + (S.roll % 2 ? 'roll2' : 'roll') + '">Cena na upit</span></p></div><p style="font-size:.875rem;color:#5E4C3E;text-align:right;max-width:14rem">Cena zavisi od mera i materijala. <span class="ph">[[PLACEHOLDER: cenovnik]]</span></p></div>' +
      steps +
      '<div class="ctas"><a class="pill" href="' + inquiry + '">Zatraži ponudu po meri</a><div class="share">' +
      '<a class="pill pill--o" style="padding-right:1rem" href="viber://forward?text=' + encodeURIComponent(summary) + '">Viber</a>' +
      '<a class="pill pill--o" style="padding-right:1rem" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=' + encodeURIComponent(summary) + '">WhatsApp</a>' +
      '<a class="pill pill--o" style="padding-right:1rem" target="_blank" rel="noopener noreferrer" href="https://ig.me/m/enterijer_mihic">Instagram</a></div>' +
      '<button class="pill pill--o" type="button" style="padding-right:1.5rem" data-save>Kopiraj link</button><p class="savednote" aria-live="polite">' + esc(S.saved) + '</p></div>' +
      '</div></div>' +
      '<div class="trust"><div><b>Dostava</b><span>Besplatna dostava za Beograd</span></div><div><b>Materijal</b><span>Boja i materijal po izboru</span></div><div><b>Izrada</b><span>Izrada po meri</span></div><div><b>Garancija</b><span class="ph">[[PLACEHOLDER: garancija]]</span></div><div><b>Plaćanje</b><span class="ph">[[PLACEHOLDER: načini plaćanja]]</span></div></div>' +
      '<div class="g-2" style="margin-top:5rem"><div><h2 class="t-h2" style="margin-bottom:1.25rem">Specifikacije</h2><table class="specs"><tbody>' +
      '<tr><th scope="row">Dimenzije</th><td class="num">' + (pr.dims ? pr.dims.map(function (d) { return d + '×200'; }).join(', ') + ' cm' : 'Po meri, na upit') + '</td></tr>' +
      '<tr><th scope="row">Materijal</th><td>' + (pr.material ? esc(pr.material) : '<span class="ph">[[PLACEHOLDER: materijal i konstrukcija]]</span>') + '</td></tr><tr><th scope="row">Boja i dekor</th><td>Po izboru · <span class="ph">[[PLACEHOLDER: paleta dekora i materijala]]</span></td></tr><tr><th scope="row">Rok izrade</th><td><span class="ph">[[PLACEHOLDER: rok izrade]]</span></td></tr><tr><th scope="row">Dostava</th><td>Besplatna dostava za Beograd · <span class="ph">[[PLACEHOLDER: rok montaže i dostava van Beograda]]</span></td></tr></tbody></table></div>' +
      '<div class="samples" style="margin-top:0;align-self:start"><div><h2 class="t-h2">Vaš prostor</h2><p class="t-body muted" style="margin-top:.5rem;max-width:24rem">Pošaljite nam fotografiju prostora ili opis ideje — pripremamo predlog i ponudu. Konsultacije su besplatne.</p></div><a class="pill pill--o" href="' + inquiry + '">Zatraži ponudu' + ARR + '</a></div></div>' +
      '<h2 class="t-h2" style="margin:5rem 0 2rem">Slični radovi</h2><div class="pgrid is-dense">' + sim.map(function (p, i) { return card(p, i, true); }).join('') + '</div><div style="height:6rem"></div></div>' +
      '<div class="sbar"><div><p class="t-micro muted" style="font-size:.6875rem">' + esc(pr.name) + ' · <span class="num">' + dimLabel + '</span></p><p class="price num">Cena na upit</p></div><a class="pill" href="' + inquiry + '">Zatraži ponudu</a></div>';
  }
  function query(pr) {
    var c = S.cfg;
    return 'model=' + pr.slug + (pr.parts ? '&komad=' + encodeURIComponent(c.part) : '') + '&mere=' + c.dim + '&ton=' + c.fabric + (pr.extras ? '&dodaci=' + encodeURIComponent(c.extras.join('|')) : '');
  }
  function render() {
    var pr = find(S.slug);
    if (pr) renderProduct(pr); else renderList();
    if (window.matchMedia && window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-active', e.isIntersecting); }); }, { rootMargin: '-30% 0px -30% 0px' });
      app.querySelectorAll('.card').forEach(function (cd) { io.observe(cd); });
    }
  }
  function open(slug, push) {
    S.slug = slug; S.cfg = freshCfg(find(slug)); S.saved = ''; S.roll += 1;
    if (push) history.pushState({ slug: slug }, '', slug ? 'katalog?model=' + slug : 'katalog' + (S.cat !== 'all' ? '?kategorija=' + S.cat : ''));
    render(); window.scrollTo(0, 0);
  }
  function setCfg(patch) { for (var k in patch) S.cfg[k] = patch[k]; S.roll += 1; S.saved = ''; var y = window.scrollY; render(); window.scrollTo(0, y); }

  app.addEventListener('click', function (e) {
    var t = e.target.closest('button, a'); if (!t || !app.contains(t)) return;
    if (t.hasAttribute('data-open')) { e.preventDefault(); open(t.getAttribute('data-open'), true); return; }
    if (t.hasAttribute('data-list')) { e.preventDefault(); open(null, true); return; }
    if (t.hasAttribute('data-cat')) { S.cat = t.getAttribute('data-cat'); var dlg = app.querySelector('dialog'); var wasOpen = dlg && dlg.open; history.replaceState(null, '', 'katalog' + (S.cat !== 'all' ? '?kategorija=' + S.cat : '')); render(); if (wasOpen) app.querySelector('dialog').showModal(); return; }
    if (t.hasAttribute('data-view')) { S.dense = t.getAttribute('data-view') === 'd'; var d2 = app.querySelector('dialog'), o2 = d2 && d2.open; render(); if (o2) app.querySelector('dialog').showModal(); return; }
    if (t.hasAttribute('data-sheet')) { var d = app.querySelector('dialog'); if (d && d.showModal) d.showModal(); return; }
    if (t.hasAttribute('data-sheet-close')) { app.querySelector('dialog').close(); return; }
    var pr = find(S.slug); if (!pr) return;
    if (t.hasAttribute('data-part')) setCfg({ part: t.getAttribute('data-part') });
    else if (t.hasAttribute('data-dim')) { var v = t.getAttribute('data-dim'); setCfg({ dim: v === 'custom' ? 'custom' : Number(v) }); }
    else if (t.hasAttribute('data-fab')) setCfg({ fabric: t.getAttribute('data-fab') });
    else if (t.hasAttribute('data-save')) {
      var q = query(pr), url = new URL('katalog?' + q, location.href).href;
      history.replaceState({ slug: pr.slug }, '', 'katalog?' + q);
      S.saved = 'Link je sačuvan u adresi stranice.';
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { S.saved = 'Link realizacije je kopiran.'; app.querySelector('.savednote').textContent = S.saved; }, function () {});
      app.querySelector('.savednote').textContent = S.saved;
    }
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-sort')) { S.sort = t.value; render(); }
    if (t.hasAttribute('data-extra')) { var x = t.getAttribute('data-extra'), ex = S.cfg.extras.slice(), i = ex.indexOf(x); if (i >= 0) ex.splice(i, 1); else ex.push(x); setCfg({ extras: ex }); }
  });
  app.addEventListener('click', function (e) { if (e.target.tagName === 'DIALOG') e.target.close(); });
  window.addEventListener('popstate', function () { var q = new URLSearchParams(location.search); S.slug = q.get('model'); S.cat = q.get('kategorija') || 'all'; S.cfg = freshCfg(find(S.slug)); render(); });
  render();
})();
