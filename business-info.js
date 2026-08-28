// ============================================================
// SAHI KAAMWALA — BUSINESS INFO (single source of truth)
// ------------------------------------------------------------
// Fill in the real values below ONCE. Every page pulls the
// phone number, WhatsApp number, support email and address
// from here automatically — you never have to hunt through
// 14 HTML files again when something changes.
//
// HOW TO USE: replace every "REPLACE_ME_..." value below.
// Phone numbers must be in international format, digits only
// after the +, e.g. "+919812345678".
// ============================================================

window.SAHI_BUSINESS = {
  // Legal / display name of the company
  legalName: "REPLACE_ME_LEGAL_ENTITY_NAME",       // e.g. "Sahi Kaamwala Home Services Pvt. Ltd." or "Sahi Kaamwala Home Services" (if proprietorship)
  brandName: "Sahi Kaamwala",

  // Contact
  phoneDisplay: "REPLACE_ME_PHONE",                // e.g. "+91 98XXXXXXXX"  (shown to customers)
  phoneLink: "REPLACE_ME_PHONE_DIGITS",            // e.g. "+9198XXXXXXXX"   (used in tel: links, no spaces)
  whatsappNumber: "REPLACE_ME_WHATSAPP_DIGITS",    // e.g. "9198XXXXXXXX"    (used in wa.me links, no + or spaces)
  supportEmail: "REPLACE_ME_SUPPORT_EMAIL",        // e.g. "support@sahikaamwala.in"
  privacyEmail: "REPLACE_ME_PRIVACY_EMAIL",        // e.g. "privacy@sahikaamwala.in" (can be same as supportEmail)

  // Location
  city: "Mumbai",
  serviceAreas: "REPLACE_ME_AREAS",                // e.g. "Andheri, Bandra, Powai, Thane — expanding weekly"
  registeredAddress: "REPLACE_ME_ADDRESS",         // full registered/office address for legal pages

  // Compliance (fill once you have these — leave blank string "" until then, do NOT invent numbers)
  gstin: "",                                        // GST number, once registered
  shopActRegNo: "",                                 // Maharashtra Shop & Establishment registration number
  udyamRegNo: "",                                   // MSME/Udyam registration number

  // Support hours shown to customers
  supportHours: "9:00 AM – 8:00 PM, all days",

  // Launch scope — keep "care" categories switched off until you have
  // trained/vetted staff and proper protocols for them. See CATALOG
  // in script.js: categories are tagged active:false for exactly this reason.
  launchTradesOnly: true
};

// ---- Applies the values above to every page automatically ----
document.addEventListener("DOMContentLoaded", () => {
  const b = window.SAHI_BUSINESS;

  document.querySelectorAll("[data-sk-phone-link]").forEach(el => {
    el.setAttribute("href", "tel:" + b.phoneLink);
  });
  document.querySelectorAll("[data-sk-phone-text]").forEach(el => {
    el.textContent = b.phoneDisplay;
  });
  document.querySelectorAll("[data-sk-whatsapp-link]").forEach(el => {
    const msg = el.getAttribute("data-sk-whatsapp-msg") || "";
    el.setAttribute("href", "https://wa.me/" + b.whatsappNumber + (msg ? "?text=" + encodeURIComponent(msg) : ""));
  });
  document.querySelectorAll("[data-sk-email-link]").forEach(el => {
    el.setAttribute("href", "mailto:" + b.supportEmail);
  });
  document.querySelectorAll("[data-sk-email-text]").forEach(el => {
    el.textContent = b.supportEmail;
  });
  document.querySelectorAll("[data-sk-privacy-email-link]").forEach(el => {
    el.setAttribute("href", "mailto:" + b.privacyEmail);
  });
  document.querySelectorAll("[data-sk-privacy-email-text]").forEach(el => {
    el.textContent = b.privacyEmail;
  });
  document.querySelectorAll("[data-sk-legal-name]").forEach(el => {
    el.textContent = b.legalName;
  });
  document.querySelectorAll("[data-sk-address]").forEach(el => {
    el.textContent = b.registeredAddress;
  });
  document.querySelectorAll("[data-sk-service-areas]").forEach(el => {
    el.textContent = b.serviceAreas;
  });
  document.querySelectorAll("[data-sk-support-hours]").forEach(el => {
    el.textContent = b.supportHours;
  });
  document.querySelectorAll("[data-sk-current-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Footer "Locations" list — splits the free-text serviceAreas string
  // ("Andheri, Bandra, Powai, Thane — expanding weekly") into individual
  // links. Trims any trailing note after a dash so it doesn't show up
  // as a fake location.
  document.querySelectorAll("[data-sk-areas-list]").forEach(el => {
    const raw = (b.serviceAreas || "").split(/[—-]/)[0]; // drop "— expanding weekly" etc.
    const areas = raw.split(",").map(a => a.trim()).filter(Boolean);
    if (!areas.length) return; // leave the fallback markup already in the HTML
    el.innerHTML = areas.map(a => `<a href="#categoryGrid">${a}</a>`).join("");
  });
});
