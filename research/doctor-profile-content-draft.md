# Research Draft: What Good Doctor/Surgeon Profile Websites Include

This is a content-planning reference (not published on the site) based on common patterns seen across:
- India: Practo & Apollo/Narayana/Manipal doctor-profile pages, individual surgeon portfolio sites
- Global: Mayo Clinic / Cleveland Clinic physician bio pages, private-practice surgeon sites (US/UK)
- Local directory listings (Google Business Profile, JustDial, hospital "Find a Doctor" pages)

Use this to decide what to add to Dr. Konati's site and what info still needs to be collected from him.

---

## 1. Sections almost every credible doctor/surgeon site has

| Section | Purpose | Status on our site |
|---|---|---|
| Hero (name, title, specialty, CTA) | First impression, instant credibility | ✅ Done |
| Trust bar / stats (years, surgeries, patients) | Quick social proof | ✅ Done |
| About / Bio | Human story + professional summary | ✅ Done (needs real detail) |
| Education & Qualifications (degrees, college, year) | Core credibility — most-checked section in India | ⚠️ Placeholder only |
| Professional Memberships / Registrations | Legal + trust signal | ❌ Missing |
| Medical Council Registration Number | Required in India for legitimacy, builds trust | ❌ Missing |
| Specialties / Conditions Treated | SEO + patient self-matching | ✅ Done, could expand |
| Procedures list (with brief "what it involves") | Patients research procedure before booking | ⚠️ Only short cards |
| Hospital/Clinic Affiliations + Timings | Where & when to find him | ✅ Partial — needs timings |
| Awards / Recognitions / Media mentions | Differentiator, builds authority | ❌ Missing |
| Patient Reviews/Testimonials | #1 trust driver before booking | ✅ Done (static/local only) |
| Photo & Video Gallery (OT, clinic, camps, awards) | Humanizes, proves legitimacy | ✅ Placeholder |
| FAQs | Reduces repetitive queries, great for SEO | ❌ Missing |
| Patient Education / Blog (e.g. "When to see a surgeon for piles") | SEO + authority | ❌ Missing (optional later) |
| Contact + Map + Directions | Conversion section | ✅ Partial — needs real data |
| Appointment Booking (form / WhatsApp / call button) | Direct conversion path | ⚠️ Static form only |
| Languages Spoken | Important in Tirupati (Telugu/English/Hindi) | ❌ Missing |
| Insurance / Payment info (cashless, TPA tie-ups) | Common patient question | ❌ Missing |
| Legal/medical disclaimer | OWASP/ethics — avoid implying guaranteed outcomes | ❌ Missing |

---

## 2. Data wishlist — please collect these from Dr. Konati

**Education & credentials**
- MBBS — college name, university, year of passing
- MS (General Surgery) — college name, year
- Any DNB / FMAS / FALS / fellowship in laparoscopic or minimal access surgery
- Andhra Pradesh Medical Council (or NMC) registration number
- Any international observerships/trainings (useful trust signal)

**Professional memberships** (very common for Indian surgeons — confirm which apply)
- Association of Surgeons of India (ASI)
- Indian Association of Gastrointestinal Endo Surgeons (IAGES)
- Indian Medical Association (IMA)
- Association of Minimal Access Surgeons of India (AMASI)

**Experience details**
- Year he started practicing independently
- Any prior hospital postings before current two (govt. hospital, teaching hospital, etc. — strong credibility if he trained at a known institute)
- Number of young surgeons trained / any teaching/visiting faculty role at a medical college

**Hospital logistics**
- OPD days & timings at Mother Hospital (mHelios)
- OPD days & timings at Ankura Hospital
- Appointment phone number(s) — separate per hospital if different
- Whether WhatsApp consultation/booking is available

**Languages spoken** (Telugu, English, Hindi, etc.)

**Recognition (optional but high-impact)**
- Any felicitations from local associations, government, or medical bodies
- Media coverage (local newspaper, TV interviews) — even a photo/clipping helps
- Free surgical camps or charitable work (very common trust-builder for Tirupati-based doctors)

**Legal**
- Clinic/hospital registration or accreditation (e.g., NABH) if applicable
- Consent note: confirm he's okay with an open, no-login review section (see risk note below)

---

## 3. Suggested additional sections to build next (ranked by impact)

1. **FAQ section** — e.g. "Is laparoscopic surgery safe for elderly patients?", "How soon can I return to work after hernia surgery?", "Do you treat emergency appendicitis cases?" — big SEO value, low effort.
2. **Languages + Insurance/TPA strip** — small trust-building addition near Contact section.
3. **Awards/Media strip** — even 3-4 logos/mentions significantly boost perceived authority.
4. **Google Maps embed + "Get Directions" buttons** for both hospitals.
5. **WhatsApp "Chat to Book" floating button** — very commonly used by Indian clinics, higher conversion than static forms.
6. **Medical disclaimer footer** — e.g. "Information on this website is for general awareness and does not replace in-person medical consultation."
7. **Structured data (schema.org `Physician`)** — not visible to users, but improves how Google displays his profile in search (ratings, specialty, address) — worth adding once real data is in.
8. **Google Business Profile alignment** — recommend creating/claiming a Google Business listing with the same name/address/phone used on the site (NAP consistency matters a lot for local SEO in Tirupati search results).

---

## 4. Important note on the review system

Since this is a static site, the current review system stores entries only in each visitor's own browser (no shared/public database). Two things to flag to the client:
- It will look empty/different for every new visitor — not a "real" public review wall yet.
- Because there's no login, a public shared version would need basic spam/abuse protection (e.g., simple captcha, profanity filter, or manual approval) before going live — open anonymous comment forms are a common target for spam bots.

If a real shared review wall is wanted later, lightweight options: Google Reviews widget (pulls his real Google Business reviews automatically, zero moderation effort), or a small serverless form (e.g. Google Form/Sheet, Firebase) with manual approval.

---

## 5. Next step

Once you get the above details from Dr. Konati (even partially), send them over and I'll replace all the `[placeholder]` fields in [index.html](../index.html) with the real content, plus add the FAQ, languages/insurance, and awards/media sections to the page.

---

## 6. Pending confirmations checklist (as of Oct 2026 build)

Items already built into the site but waiting on real data/confirmation before going live:

| Item | Where it lives | Status |
|---|---|---|
| Real WhatsApp number | Floating button, site-wide (EN & Telugu) | ✅ Confirmed by client: +91 99123 08801 — now live |
| Real phone & email | Contact section, schema `telephone`/`email` (EN & Telugu) | ✅ Confirmed by client: +91 99123 08801 / vamseedharkonati@gmail.com — now live |
| Formspree form activation | Contact form (both EN & Telugu pages) | ⏳ Needs account signup at formspree.io using vamseedharkonati@gmail.com, then swap `YOUR_FORM_ID` in both `index.html` and `te/index.html` |
| Facebook / LinkedIn / YouTube URLs | Footer social icons (both EN & Telugu pages) | ⏳ Placeholder `href="#"` — swap in real profile URLs once confirmed |
| Real photo for `og:image` | Social share preview (Facebook/WhatsApp/LinkedIn link previews) | ⏳ Currently SVG placeholder — SVG does NOT render in link previews, needs a real JPG/PNG (1200×630px recommended) once photos are available |
| Privacy Policy / Terms of Use review | [`privacy.html`](../privacy.html), [`terms.html`](../terms.html) | ⏳ Template drafted — have a lawyer review before relying on it live, especially patient-data handling under India's DPDP Act 2023 |
| Google Analytics | Commented snippet in `<head>` of `index.html` | ⏳ Optional — create free GA4 property, get Measurement ID, uncomment & fill in |

---

## 7. Third-party listing cross-check (Oct 2026) — SUPERSEDED, see correction below

Dr. Konati has public profiles on a few aggregator/hospital sites (Ankura Hospitals, HexaHealth, Justdial). Cross-referencing them initially suggested he practices at "Ankura Hospital" as his second hospital. **The client corrected this directly: his second hospital is NOT Ankura Hospital — it is Helios Hospitals Multi Super Speciality Hospital.** All Ankura-specific data (address, phone, map links) has been removed from the site and replaced with verified Google Maps data for the correct two hospitals:

| Hospital | Verified address (Google Maps) | Phone | Maps link |
|---|---|---|---|
| **Mother Hospital** | Sai Ram Street, Old Maternity Hospital Rd, Nehru Nagar, Tirupati, Andhra Pradesh 517501 | 0877 228 6112 (hospital reception, motherhospital.in) | https://maps.app.goo.gl/vcxPJyHvmUAKBtEx6 |
| **Helios Hospitals Multi Super Speciality Hospital** | 1-11, Karakambadi Rd, Mangalam, Chennayyagunta, Tirupati, Andhra Pradesh 517509 | 073311 23638 (hospital reception, helioshospitals.co.in) | https://maps.app.goo.gl/swesGhy3EpbMwosh7 |

Dr. Konati's own direct contact details (confirmed by the client, now used site-wide instead of any hospital reception number):
- Phone: **+91 99123 08801**
- Email: **vamseedharkonati@gmail.com**

**Still confirmed from earlier research** (unaffected by the hospital-name correction):
- MBBS & MS (General Surgery) from S.V. Medical College, Tirupati
- PDDC (Surgical Gastroenterology), S.V.I.M.S. University, Tirupati, 2010
- Languages: English, Telugu, Hindi
- Experience: **20+ years** (client-confirmed final figure — note this supersedes an earlier "23+ years" figure that had briefly been taken from a third-party aggregator; the client's own figure of 20+ is now used everywhere)

**OPD timings removed entirely** per client request — the Hospitals section now shows only verified address + map + directions link for each hospital, no timing claims.

**Note on name spelling:** Ankura Hospitals' own bio paragraph (no longer relevant to this site) referred to him as "Dr. K. Vamseedhar" in running text. This doesn't change our decision — the site intentionally uses "Dr. Vamseedhar Konati" per the client's explicit instruction earlier in this project.

