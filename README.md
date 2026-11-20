# Enterijer Mihić — sajt

Statičan, jednostrani sajt bez zavisnosti (HTML + CSS + vanilla JS). Može da se hostuje bilo gde: Netlify, Vercel, Cloudflare Pages, GitHub Pages ili običan hosting — dovoljno je postaviti sadržaj ovog foldera.

```
index.html              sadržaj i struktura stranice
assets/css/main.css     dizajn sistem (boje, tipografija, grid, animacije)
assets/js/config.js     ⟵ PODEŠAVANJA ZA POKRETANJE (kontakt, obrazac)
assets/js/main.js       navigacija, galerija, lightbox, obrazac
assets/img/             slike (WebP u više veličina) + og-image.jpg
robots.txt, sitemap.xml SEO datoteke (zameniti DOMEN)
tools/build.py          priprema slika i pregled u jednom fajlu
```

## Pre objavljivanja — šta je potrebno dostaviti

Ništa od navedenog nije izmišljeno na sajtu; dok podatak ne unesete, odgovarajući red se ne prikazuje.

| # | Šta | Gde se unosi |
|---|-----|--------------|
| 1 | **Adresa za prijem upita** (npr. Formspree, Basin, Getform ili sopstveni API koji prima `multipart/form-data` i vraća 2xx) | `config.js` → `formEndpoint` |
| 2 | Da li servis prima priložene fajlove (Formspree: samo plaćeni paketi) | `config.js` → `acceptsFiles` |
| 3 | Broj telefona: uneto (+381 65 911 4646) | `config.js` → `phone` |
| 4 | E-mail adresa | `config.js` → `email` |
| 5 | Instagram profil (pun URL) | `config.js` → `instagram` |
| 6 | Politika privatnosti (stranica ili PDF) | `config.js` → `privacyPolicyUrl` |
| 7 | Produkcijski domen: trenutno https://vilceknenad1.github.io/Mihic-entrerijer/ (ako pređete na sopstveni domen, zamenite adresu) | `index.html` (canonical, odkomentarisati), `og:image` kao apsolutni URL, `robots.txt`, `sitemap.xml` |
| 8 | Prave fotografije realizovanih projekata (kada postoje) | `assets/img/` + `index.html`, sekcija `#nasi-radovi` |

**Obrazac:** dok `formEndpoint` nije popunjen, obrazac proverava unos, ali posetiocu jasno kaže da slanje još nije aktivno — nikad ne prikazuje lažnu potvrdu i ne odbacuje poruke tiho. Potvrda „upit je primljen" prikazuje se samo kada server odgovori uspešno. Zaštita od spama: skriveno polje (honeypot) + minimalno vreme popunjavanja; za dodatnu zaštitu uključite spam filter u izabranom servisu.

Polja koja obrazac šalje: `name`, `phone`, `email`, `type`, `dimensions`, `message`, `files` (0–3 fajla, do 10 MB), `_subject`.

**LocalBusiness strukturirani podaci** nisu dodati namerno — dodajte ih tek kada su naziv, adresa/područje i kontakt verifikovani.

## Slike

Fotografije realizovanih radova (prefiks `r…` u `assets/img/`) preuzete su sa javnog Instagram profila @enterijer_mihic 20. 11. 2026. Spisak objava i datuma je u `tools/IZVOR-FOTOGRAFIJA.md`. Izmene su blage: ujednačen balans bele boje i kontrast, izoštravanje i isecanje nereda sa ivica kadra. Sam nameštaj nije retuširan.

Fotografije su na sajtu u sekcijama Nameštaj po meri, Naš pristup, Dostava i u galeriji Naši radovi. Vizualizacije su ostale u hero sekciji, u sekciji „Ne uklapajte život u nameštaj“ i kod krupnih planova materijala, i tamo su označene kao vizualizacije. Kada budu postojale profesionalne fotografije, mogu da zamene i njih.

Nisu korišćeni: sto-pregrada (Instagram na tim slikama prikazuje oznaku „Sadržaj generisan uz pomoć AI“), objava sa TV programom na ekranu, ugao kupatila sa tuđim proizvodom na ormariću i nekoliko slabije osvetljenih snimaka.

Nova fotografija se dodaje u galeriju tako što se kopira jedan `<figure class="g-item">`, pa se podese `data-cat` (`kuhinje`, `plakari`, `dnevne`, `spavace`, `ostalo`), `data-title`, `alt` i putanje. Filteri i brojači se ažuriraju sami.

## Pristupačnost i performanse

- Jedan H1, logična hijerarhija naslova, opisni `alt` tekstovi na srpskom.
- Vidljiv fokus, „Preskoči na sadržaj", navigacija tastaturom (meni, galerija, lightbox: ← → Esc, zarobljen fokus).
- `prefers-reduced-motion` gasi animacije; sav sadržaj je vidljiv i bez njih.
- Responzivne WebP slike sa `srcset`, `width/height` (bez pomeranja rasporeda), lazy loading ispod prvog ekrana, hero se predučitava.
- Fontovi: Cormorant Garamond + Manrope (Google Fonts, sa latin-ext za š, č, ć, ž, đ).

## Animacije (motion sloj)

`assets/js/fx.js` koristi GSAP 3.12.5 + ScrollTrigger (cdnjs) i Lenis 1.1.13 (jsDelivr) za glatko skrolovanje:
uvodna animacija sa kotom 0 → 2400 mm, otkrivanje naslova slovo po slovo i reč po reč, slike koje se otvaraju i blago pomeraju pri skrolu,
prikovana „signature" sekcija i proces izrade, marquee traka koja se pomera samo dok skrolujete, magnetna dugmad, kursor sa oznakom (samo miš), zrno filma.

- Ako posetilac ima uključeno „smanji pokrete" ili se biblioteke ne učitaju, sloj se isključuje i sajt radi sa jednostavnim prikazom — sav sadržaj ostaje vidljiv.
- Uvodna animacija traje oko 3 s i preskače se kada se stranica otvori dalje od vrha.
- Za potpuno samostalan hosting biblioteke možete preuzeti u `assets/vendor/` i promeniti tri `<script src>` putanje na dnu `index.html`.
