# SellTru — Session Vault
*A running log of all blog interviews, changes, and important site details across Claude Cowork sessions.*

---

## Andrew's Preferences (Always Follow These)

- **Interview questions must be asked ONE AT A TIME.** Andrew answers via voice note and cannot respond to a list of questions at once. Wait for each answer before asking the next.
- **Never write a blog post without first receiving Andrew's answers.** No exceptions.
- **Tone:** Conversational but authoritative. Use Andrew's exact phrasing and opinions where possible — this is his expert voice, not AI-generated content.

---

## Site Infrastructure

| Detail | Value |
|--------|-------|
| Domain | https://selltru.com |
| Hosting | Netlify |
| Repo | GitHub (git push deploys automatically) |
| Analytics | Google Analytics (GA4) — ID: `G-Z5ZERMY21K` |
| Fonts | Plus Jakarta Sans (headings), Inter (body) — loaded via Google Fonts |
| Components | `<selltru-header>` and `<selltru-footer>` — custom web components via `/js/components.js` |
| Reveal animations | `.reveal` / `.revealed` classes — triggered by `/js/main.js` |
| CSS variables | `--navy`, `--blue`, `--orange`, `--text`, `--text-light`, `--gray-50`, `--gray-200`, `--font-head`, `--radius-lg`, `--radius-xl`, `--shadow-md`, `--transition` etc. |

### Files Never to Push (`.gitignore`)
- `mailchimp_setup.py`
- `mailchimp_automations.py`
- `mailchimp_email_templates.html`
- `gsc-indexing-log.md`
- `seo-report/`

### Redirects (`_redirects`)
Old Fort Lauderdale agency pages 301 → homepage. Key ones:
- `/amazon-management` → `/amazon-marketing`
- `/contact` → `/about`
- `/news/*` → `/blog`
- Catch-all `/*` → `/404.html`

---

## Blog Post Requirements (Always Apply These)

- **File location:** `C:\Users\andre\Documents\Selltru Website\blog\[slug].html`
- **Copy nav/footer/CSS from existing post** — use `amazon-listing-optimization-guide-2026.html` as the master template
- **All body `<a>` tags** must include `style="color:var(--blue);"` or links will be invisible
- **Target word count:** 1,500–2,000 words
- **Structure:** H1 with primary keyword, H2s with keyword variants, callout boxes, checklist, CTA box, guest post banner
- **Schema:** Article (every post) + HowTo (step-by-step posts) + FAQPage (posts with FAQ section)
- **OG tags:** `og:title`, `og:description`, `og:type`, `og:url` — match site pattern (no `og:image`)
- **Inbound links:** Minimum 3 from existing pages after publishing
- **Metadata updates after every post:** `blog.html` (new card at top), `sitemap.xml` (priority 0.7), `llms.txt` (one-line description)
- **GSC:** Add new URL to `gsc-indexing-log.md` for submission next session

### Blog Card Thumb Classes
- Amazon posts → `class="amz"` (orange gradient)
- Walmart posts → `class="wmt"` (blue gradient)
- Strategy/agency posts → `class="str"` (navy gradient)
- PPC posts → `class="ppc"` (green gradient)

---

## All Blog Posts Published

### Amazon Posts

| # | Slug | Title | Date |
|---|------|-------|------|
| 1 | `why-amazon-sales-dropped` | Why Your Amazon Sales Dropped (And What to Fix First) | 2026-04-26 |
| 2 | `how-to-reduce-amazon-acos` | How to Reduce Amazon ACOS Without Cutting Ad Spend | 2026-04-26 |
| 3 | `is-amazon-marketing-agency-worth-it` | Is Hiring an Amazon Marketing Agency Really Worth the Cost? | 2026-04-26 |
| 4 | `questions-to-ask-amazon-marketing-agency` | What Questions Should I Ask Before Hiring an Amazon Marketing Agency? | 2026-04-26 |
| 5 | `amazon-listing-optimization-guide-2026` | Amazon Listing Optimization: The Complete Guide for 2026 | 2026-04-26 |
| 6 | `amazon-sponsored-products-vs-sponsored-brands` | Amazon Sponsored Products vs Sponsored Brands: Which Should You Use? | 2026-04-27 |
| 7 | `how-to-launch-new-product-on-amazon` | How to Launch a New Product on Amazon: The 30-Day Playbook | 2026-04-27 |
| 8 | `amazon-keyword-research-guide` | How to Find Relevant Keywords for Your Amazon Product Listing | 2026-04-29 |
| 9 | `amazon-agency-vs-in-house` | Amazon Agency vs. In-House Team: What's Actually Better? | 2026-04-30 |
| 10 | `amazon-ppc-management-cost` | How Much Does Amazon PPC Management Cost? | 2026-04-30 |
| 11 | `amazon-tacos-advertising` | Amazon TACoS Explained: The Metric That Actually Tells You If Ads Are Working | 2026-04-30 |
| 12 | `best-amazon-ppc-agencies-2026` | Best Amazon PPC Agencies 2026: Ranked by a Practitioner | 2026-05-05 |
| 13 | `amazon-a-plus-content-guide` | Amazon A+ Content: How to Lift Conversion Rates | 2026-05-06 |

### Walmart Posts

| # | Slug | Title | Date |
|---|------|-------|------|
| 1 | `does-walmart-have-ppc-advertising` | Does Walmart Have PPC Advertising for Sellers? | 2026-04-26 |
| 2 | `how-to-expand-amazon-brand-to-walmart` | How to Expand Your Amazon Brand to Walmart.com | 2026-04-27 |
| 3 | `fastest-way-to-grow-walmart-marketplace-sales` | Fastest Way to Grow Sales by Adding Walmart Marketplace | 2026-04-28 |
| 4 | `walmart-vs-amazon-2026` | Walmart vs Amazon: Where Should Your Brand Focus in 2026? | unknown |
| 5 | `how-to-rank-on-walmart-search-2026` | How to Rank on Walmart Search in 2026: The Complete Guide | unknown |

---

## Blog Interview Log

### Post 13 — 2026-05-06
**Title:** Amazon A+ Content: How to Lift Conversion Rates
**Slug:** `amazon-a-plus-content-guide`

| Q | Andrew's Answer (Summary) |
|---|--------------------------|
| Core problem | A+ Content separates good listings from great ones — helps fence-sitters decide why your product is better than a competitor's |
| Target reader | New sellers learning what A+ is + established brands with outdated A+ content |
| #1 takeaway | A+ appears directly above the reviews — someone willing to scroll that far is a serious buyer, and this is your last shot to close them before they read someone else's opinion |
| Common mistake | Brands think it's fluff — in reality it significantly lifts conversion and is the line between a good and great listing |
| Example/result | Sports brand selling $100 below competitor for nearly identical product — rebuilt A+ around objections, raised price $50 and sustained it, improving margins |
| Framework | 1) Start with customer/positioning 2) Review existing listing 3) Narrow core selling points 4) Study competitor A+ 5) Optimize for mobile |
| What agencies get wrong | Treat it like a design project not a conversion project; repeat bullet points instead of answering objections; ignore mobile; don't align with PPC keywords |
| Data/stats | Amazon: Basic A+ increases sales up to 8%, Premium A+ up to 20% |
| Next step for reader | Audit their own A+ on mobile, thinking like a buyer — read reviews, check competitors, make sure A+ supports PPC traffic |
| Phrases/opinions | "Every section of your A+ Content should answer one hesitation to purchase your product" |

**Additional answers gathered for expanded version:**

*What is A+ Content?* Template-based feature in Amazon — Basic is images/copy, Premium adds video and interactive modules. Sits below bullets/buy box, directly above reviews. Can show comparison charts, brand store links, specs, features, use cases.

*Premium vs Basic?* Premium only worth it when listing already has traffic to convert. Video especially valuable for products needing demonstration (apps, fitness equipment, skincare application). Premium-priced products should prioritize it — visual quality signal alone can justify a higher price.

*Does it help SEO?* Not directly — A+ isn't indexed for keywords. Helps indirectly by improving conversion → better conversion signals organic rank to Amazon's algorithm.

*Approval timeline?* 2–7 business days, often faster (~48 hours). Rejection reasons: supplement/health claims, external links, low-quality images.

---

## Session Change Log

### 2026-05-06
- Published Post 13: `amazon-a-plus-content-guide.html`
- Fixed slug (initially `amazon-a-plus-content-conversion` → corrected to `amazon-a-plus-content-guide`)
- Added inbound links from: `amazon-listing-optimization-guide-2026.html`, `amazon-keyword-research-guide.html`, `how-to-launch-new-product-on-amazon.html`
- Updated: `blog.html`, `sitemap.xml`, `llms.txt`, `gsc-indexing-log.md`
- Fixed CSS bug: `.faq-item:last-child` selector not firing — wrapped in `.faq-list` container
- Fixed truncated file: file cut off mid-attribute during editing — detected via automated check, repaired with Python
- Added OG tags to match site pattern
- Saved Andrew's voice-note interview preference to `CLAUDE.md`
- Created this vault file

---

## Topics Already Covered (Avoid Duplicates)

**Amazon:** Sales dropped diagnosis, reducing ACoS, agency worth it, questions to ask agency, listing optimization, Sponsored Products vs Brands, new product launch, keyword research, agency vs in-house, PPC management cost, TACoS, best PPC agencies 2026, A+ Content

**Walmart:** Does Walmart have PPC, expanding Amazon brand to Walmart, growing Walmart sales, Walmart vs Amazon 2026, ranking on Walmart search 2026

## Topic Ideas Not Yet Covered

**Amazon:** Amazon DSP, Amazon Brand Store design, Amazon Vine program, Amazon FBA vs FBM, Subscribe & Save, external traffic to Amazon, Amazon attribution, seasonal/Q4 strategy, Amazon coupons & deals, account health management, Seller Central vs Vendor Central

**Walmart:** Walmart Fulfillment Services (WFS) deep dive, Walmart seller fees breakdown, Walmart listing best practices, Walmart reviews strategy, Walmart+ for sellers

---

*Updated: 2026-05-06*
