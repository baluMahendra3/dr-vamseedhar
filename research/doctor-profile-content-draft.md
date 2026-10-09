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
| Real WhatsApp number | Floating button (`wa.me/91XXXXXXXXXX`), site-wide | ⏳ Placeholder — confirm number |
| Formspree form activation | Contact form (both EN & Telugu pages) | ⏳ Needs account signup at formspree.io using vamseedharkonati@gmail.com, then swap `YOUR_FORM_ID` in both `index.html` and `te/index.html` |
| Facebook / LinkedIn / YouTube URLs | Footer social icons (both EN & Telugu pages) | ⏳ Placeholder `href="#"` — swap in real profile URLs once confirmed |
| Real photo for `og:image` | Social share preview (Facebook/WhatsApp/LinkedIn link previews) | ⏳ Currently SVG placeholder — SVG does NOT render in link previews, needs a real JPG/PNG (1200×630px recommended) once photos are available |
| Privacy Policy / Terms of Use review | [`privacy.html`](../privacy.html), [`terms.html`](../terms.html) | ⏳ Template drafted — have a lawyer review before relying on it live, especially patient-data handling under India's DPDP Act 2023 |
| Google Analytics | Commented snippet in `<head>` of `index.html` | ⏳ Optional — create free GA4 property, get Measurement ID, uncomment & fill in |

---

## 7. Third-party listing cross-check (Oct 2026)

Dr. Konati already has public profiles on a few aggregator/hospital sites. Cross-referencing them turned up real, usable facts — now merged into the site — plus some conflicts that still need the doctor's own confirmation.

**Confirmed and now live on the site** (agreed by 2+ independent sources, or an official hospital's own profile):
| Fact | Source(s) | Where it's now used |
|---|---|---|
| MBBS & MS (General Surgery) from **S.V. Medical College, Tirupati** | Ankura Hospitals (official) + HexaHealth | Qualifications timeline |
| PDDC (Post Doctoral Diploma Course) — Surgical Gastroenterology, **S.V.I.M.S. University, Tirupati, 2010** | Ankura Hospitals (official profile) — single source | Qualifications timeline + Physician schema `alumniOf` |
| Languages: **English, Telugu, Hindi** | Ankura Hospitals (official profile) | FAQ answer + schema (previously a placeholder) |
| Hospital affiliation: **Helios Hospital** = our "Mother Hospital (mHelios)" | HexaHealth | Confirms existing Hospitals section entry |
| Additional confirmed procedures: laser piles surgery, HAL-RAR, GERD surgery, mastectomy, circumcision, endoscopic sleeve gastroplasty | HexaHealth "Top Treatments" list | Expanded Expertise cards + schema `availableService` |
| **Ankura Hospital full address**: H No. 19-3-14/N, Ward No. 19, Block No. 3, Renigunta Rd, P&T Colony, Tirupati, Andhra Pradesh 517501, phone +91 9053 108 108 | Ankura Hospitals' own Tirupati location page (official) | Hospital card + Contact section + map embeds + schema `streetAddress`/`postalCode`/`telephone` |
| **Mother Hospital (mHelios) OPD timing**: Mon–Sat, 10:00 AM–8:00 PM (single continuous slot) | HexaHealth | Replaced the earlier fabricated two-slot "sample timing" |
| **Mother Hospital (mHelios) partial address**: "18-2-148" (door number only, street/area name not shown on any source) | HexaHealth | Added as "Door No. 18-2-148" with a flag that the street/area is still unconfirmed |

**Still only 2 confirmed hospitals, not 3** — if there's a third practice location (e.g. a personal clinic), please tell me its name so I can add a proper map pin for it too; I didn't want to guess and publish a wrong address.


|---|---|---|
| Locality **"Mangalam, Tirupati – 517507"** | Justdial (directory listing, single source) | Could be a clinic/consulting address, but not confirmed which hospital or if it's current — do not publish as an official address without the doctor's sign-off |
| "9 years practicing laparoscopic surgery" (as his primary interest) | Ankura Hospitals bio text | Vague/relative phrasing with no clear start date — skip rather than guess |

**Resolved:** Years of experience was confirmed by the client as **23+ years** (matches Ankura Hospitals' figure, not HexaHealth's "10+ years") — updated site-wide on both EN/TE pages (hero, stats, trust badge, about section, qualifications timeline, meta description, og:description, schema `description`).

**Note on name spelling:** Ankura Hospitals' own bio paragraph still refers to him as "Dr. K. Vamseedhar" in running text (even though their page heading drops the "K."). This doesn't change our decision — the site intentionally uses "Dr. Vamseedhar Konati" per the client's explicit instruction earlier in this project.

