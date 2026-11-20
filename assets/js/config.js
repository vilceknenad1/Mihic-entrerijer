/* =====================================================================
   ENTERIJER MIHIĆ — LAUNCH CONFIGURATION
   Fill these in before the site goes live. Empty values stay hidden on
   the page; nothing is invented. See README.md, "Pre objavljivanja".
   ===================================================================== */
window.SITE_CONFIG = {
  /* Where the inquiry form is POSTed (multipart/form-data).
     Any endpoint that answers 2xx on success works, e.g. a Formspree form
     ("https://formspree.io/f/xxxxxxx"), Basin, Getform, or your own API.
     While this is empty the form validates input but clearly tells the
     visitor that online sending is not active yet — it never pretends. */
  formEndpoint: "",

  /* Does the endpoint accept file attachments? (Formspree: paid plans only) */
  acceptsFiles: true,

  /* Verified public contact details. Leave "" to hide a row. */
  phone: "+381 65 911 4646",
  email: "",          // e.g. "info@domen.rs"
  instagram: "https://www.instagram.com/enterijer_mihic/", // javni profil, proveren 20. 11. 2026.
  privacyPolicyUrl: "" // e.g. "/politika-privatnosti.html"
};
