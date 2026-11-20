# Enterijer Mihić — sajt (prilagođen sa EN-DIZAJN predloška)

Statički sajt: ista struktura, hero, animacije i dizajn kao [en-dizajn037](https://vilceknenad1.github.io/en-dizajn037/), sa tekstovima i fotografijama Enterijer Mihić.

Predpregled lokalno:

```bash
python3 -m http.server 8080 --directory .
```

Zatim otvorite http://localhost:8080/

## Objavljivanje na GitHub Pages

1. Napravite novi repozitorijum (npr. `enterijer-mihic`).
2. „uploading an existing file“ → prevucite **sav sadržaj** raspakovanog foldera (ne sam folder), uključujući `.nojekyll`.
   Na macOS-u skrivene fajlove u Finderu prikazujete sa Cmd + Shift + .
3. Commit changes.
4. Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.
5. Posle 1–2 minuta sajt je na `https://korisnik.github.io/enterijer-mihic/`.

**Adresa:** `robots.txt` i `sitemap.xml` već imaju `https://vilceknenad1.github.io/enterijer-mihic/`. Ako repozitorijum nazovete drugačije, promenite adresu u oba fajla.

**Sopstveni domen:** Settings → Pages → Custom domain, pa kod registrara dodajte DNS zapise koje GitHub prikaže. Uključite „Enforce HTTPS“. Posle toga upišite adresu u `robots.txt` i `sitemap.xml`.

**Napomene:**
- `.nojekyll` mora da ostane u korenu.
- `assets/img/logo.jpg` i `logo.png` sajt više ne koristi (zaglavlje ima naziv ispisan slovima). Obrišite ih pre otpremanja, pa folder ima 99 fajlova, ispod GitHub-ovog limita od 100 po jednom otpremanju.
- Adrese bez `.html` rade (`/katalog`), kao i `katalog?model=plakar-hrast`.
- `vercel.json` GitHub ignoriše. Može da ostane ako želite i Vercel kao rezervu.

## Pre puštanja u javnost (otvorene stavke)

Sve što nije potvrđeno je na sajtu vidljivo označeno kao `[[PLACEHOLDER: …]]`:
- email, adresa / grad, radno vreme, PIB/MB i pravni tekstovi;
- da li je +381 65 911 4646 i na Viberu i na WhatsApp-u (oba dugmeta vode na taj broj);
- cenovnik, rok izrade i montaže, dostava van Beograda, garancija, načini plaćanja;
- paleta dekora i materijala;
- vektorski logo za zaglavlje (sada je naziv ispisan slovima, Cormorant Garamond);
- da li ostaje pravopis „Mihić“ ili „Mihic“ kao na Instagramu;
- da li su dve fotografije stola-pregrade AI-sadržaj (Instagramov bedž je isečen);
- opisi dve objave bez natpisa (manja kuhinja, tamni ormar);
- servis za newsletter (forma je sada samo prikaz, ne šalje podatke — `assets/js/main.js`, TODO).

Telefon potvrđen od klijenta 20. 11. 2026: +381 65 911 4646.

Potvrđeno sa javnog profila @enterijer_mihic (20. 11. 2026.): nameštaj po meri, besplatna dostava za Beograd, besplatne konsultacije, izbor boja i materijala.
