# Sahi Kaamwala — Setup Checklist

## 1. The one file you need to edit first: `business-info.js`

Open `business-info.js` and replace every `REPLACE_ME_...` value:

| Field | What to put |
|---|---|
| `legalName` | Your registered business name (once you have one — see licensing notes below) |
| `phoneDisplay` / `phoneLink` | Your real support number, in international format |
| `whatsappNumber` | Same number, digits only, no `+` |
| `supportEmail` | e.g. `support@yourdomain.in` |
| `privacyEmail` | Can be the same as supportEmail |
| `serviceAreas` | e.g. "Andheri, Bandra, Powai — expanding weekly" |
| `registeredAddress` | Your office/registered address |

Every page (header, footer, chatbot, policy pages) pulls from this one file automatically — you never need to hunt through individual HTML files again.

## 2. What was changed and why

- **Fixed missing mobile viewport tag** on 13 of 14 pages — they were likely rendering zoomed-out on phones.
- **Fixed missing `<!DOCTYPE html>`/`<head>`/`<body>` structure** on the same pages (technically invalid HTML before).
- **painter.html / plumber.html** used to show workers' raw phone numbers directly with no verification step — now match the safer verified-contact flow the rest of the site uses.
- **Removed the ₹50 customer sign-up fee** (`auth.js`) — customer accounts are now free. This matches standard marketplace practice and removes a real conversion blocker. Worker onboarding still has the one-time ₹100 fee.
- **"Care" categories (Women Aid, Medical Aid, Old Age Assistance) are switched off** the homepage booking grid (`active: false` in `script.js`) — they're higher-risk categories (the old catalog included things like "Ambulance service" and "Doctor on call," which you should not offer until you have actually arranged licensed medical staff/ambulance partners). The pages still exist and show genuine public emergency helpline numbers, with a clear banner saying booking isn't open yet. Flip `active: true` in `script.js` once you have real, vetted staff and a safety protocol for that category — and get it reviewed by a lawyer first.
- **Softened "verified" language** — the worker onboarding fee explicitly says it covers ID collection, not a police/background check, until you actually have one.
- **Fixed contradictions** in Terms & Refund Policy — they used to reference a ₹50 customer fee that didn't match the free signup, and said job payments aren't processed on-platform when the code actually does charge online via Razorpay. Refund policy now has real cancellation tiers.
- **Added an About Us block** on the homepage and business-identity placeholders on the policy pages.

## 3. Still needs your input / a human decision

- [ ] Fill in `business-info.js` (see table above)
- [ ] Get a proper domain (e.g. `sahikaamwala.in`) — GitHub Pages URLs hurt trust for a paying customer
- [ ] Get a business email on that domain
- [ ] Have a lawyer/CA review `privacy.html`, `terms.html`, `refund-policy.html` before real launch — the in-page disclaimer says this too
- [ ] Decide worker uniform + ID card program (you mentioned this) and add a short line about it to the About Us block once it's real, not before
- [ ] Once you have GST/Shop Act numbers, add them to `business-info.js` (`gstin`, `shopActRegNo`)
- [ ] Check your Firestore Security Rules are locked down (not "test mode") — this is the real security boundary for a Firebase app, not hiding the API key in the frontend (that key is meant to be public)
- [ ] Aadhaar/PAN numbers are currently stored as plain text fields in Firestore (`join.html` → `worker_applications`). For a real launch, consider not storing full ID numbers at all (just "ID checked: yes/no" + last 4 digits), since India's DPDP Act treats this as sensitive personal data.

## 4. Recommended before public launch

- Add approximate price ranges per service (you already have per-service pricing in the booking flow via `SahiPricing` — consider surfacing a "starting from ₹X" on each category card too)
- Add a couple of real customer/worker photos and short testimonials once you have your first jobs done
- Add real worker profile details (years of experience, languages) once you're onboarding your uncle's contacts
