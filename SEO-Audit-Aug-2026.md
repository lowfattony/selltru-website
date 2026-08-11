# SellTru SEO Audit — August 10, 2026

Generated with the claude-seo skill (v2.2.4) — three specialist audits run in parallel against the live site: technical/sitemap/performance, content/E-E-A-T/SXO, and schema/GEO. All findings below were verified against live HTTP responses, not assumptions.

**Overall SEO Health Score: 68/100**
(Technical foundation ~80 · Content quality ~72 · E-E-A-T ~64 · GEO/AI-readiness ~69 · Schema ~65)

The site's fundamentals are strong: clean titles, correct canonicals, proper 404s, fast Netlify hosting, excellent search-intent match on every audited page, and some textbook AI-citability blocks. The decline in clicks is most plausibly explained by the Critical/High items below — an invisible link graph for crawlers, a broken authority/identity layer, and keyword cannibalization in two clusters.

---

## CRITICAL

### C1. Site navigation is invisible to crawlers (JS-injected header/footer)
`grep -c '<nav' home.html` → **0**. All nav and footer links are injected at runtime by `/js/components.js` (`<selltru-header>`/`<selltru-footer>` custom elements). Raw HTML contains only in-body links (home: 20, blog posts: 10–11).

Why it matters: robots.txt welcomes GPTBot, ClaudeBot, and PerplexityBot — but **no AI crawler executes JavaScript**, and Google's first crawl wave doesn't either. To them, every page has no navigation: crawl discovery, PageRank flow, and AI comprehension of site structure all degrade. This is the single most likely technical contributor to declining clicks.

Fix: render header/footer as static HTML in each page at build time (simple templating or a Python build script); keep components.js for interactive behavior only. Verify: `curl -s https://selltru.com/ | grep -c '<nav'` ≥ 1.

### C2. Organization logo 404s — brand has zero working image reference
Homepage schema declares `"logo": "https://selltru.com/img/selltru-logo.png"` → **HTTP 404**. Combined with no `og:image` anywhere on the site, there is no working brand image in any metadata. Fix: upload the logo file (112px+ square-ish PNG), re-verify with `curl -I`.

### C3. The About page never mentions Andrew Deramo
`grep -c "Andrew" about.html` → **0**. Yet Article schema on the best-agencies post cites `"author": {"@type":"Person","name":"Andrew Deramo","url":"https://selltru.com/about"}`, and the homepage founder card links "Read the Full Story" to /about. Anyone (or any LLM) following the author URL finds a page without him. The entire E-E-A-T narrative ("$150M+ managed," practitioner rankings) rests on one identifiable person whose canonical page is empty of him. About is also thin (759 words).

Fix: add a founder section to /about — photo, career timeline, the "I hired agencies as a business owner" story, LinkedIn/Upwork links — or create a dedicated author page and point all bylines and author schema there.

---

## HIGH

### H1. Duplicate URL variants: nav links use `.html`, both versions return 200
All components.js hrefs use `.html` URLs (`/amazon-marketing.html`, `/blog.html`, etc.) while canonicals and sitemap use clean URLs. Both variants return 200 with no redirect. Google crawls two URLs per page and reconciles via canonical hints. Fix: switch all hrefs to clean URLs + add 301s in Netlify `_redirects` (`/:page.html /:page 301`, `/blog/:post.html /blog/:post 301`) or enable Netlify Pretty URLs.

### H2. Walmart Connect keyword cannibalization — 6–7 URLs on one cluster
Three long posts covering the same setup/bids/costs space: `walmart-connect-ads` (3,071 words), `walmart-connect-ads-guide` (4,456), `how-to-advertise-on-walmart` (3,744) — plus service pages `walmart-connect-ads-agency`, `walmart-connect-ads-cost`, `walmart-advertising-cost`, and the calculator. Fix: merge `walmart-connect-ads` into the 4,456-word guide with a 301; keep `how-to-advertise-on-walmart` strictly on that phrasing; keep cost queries on service pages only. Also merge the TACoS pair: `amazon-ppc-beyond-acos-tacos` (1,257 words) → 301 into `amazon-tacos-advertising` (1,736 words).

### H3. Most posts bylined "By SellTru" (Organization), not Andrew
Only the best-agencies post has the Person byline + credentials + visible dates. Posts full of first-person experience ("a mistake we see constantly") are attributed to nobody. Fix: convert all posts to "By Andrew Deramo" using the best-agencies Person schema pattern (reference `https://selltru.com/#andrew-deramo` via `@id`), add visible bylines, dates, and an author box.

### H4. Unverifiable proof claims
"★★★★★ Trusted by 200+ brands" with no testimonials, review links, or rating source anywhere. Case-studies page has **0 images** despite the homepage claiming "screenshots from live accounts." Homepage "45% average ACOS reduction" clashes with the flagship case study (49%→43%). Certifications (SPN, Upwork Top Rated Plus) have no outbound verification links. Fix: link the Upwork profile, add 2–3 attributed testimonials, add redacted Seller Central screenshots with date ranges to case studies, restate the 45% claim as relative reduction with an example.

### H5. /questions FAQPage schema out of sync with visible page
Schema has 31 questions; the page shows 36 cards. Wording and answers diverge, including one garbled schema answer shipped to every parser: *"(5) Will you own our data and campaigns, or will you?"* Also 3 near-duplicate Q&A pairs with contradictory numbers ($3,000–$6,000 vs $3,500–$6,000). Note: Google retired FAQ rich results May 2026, so don't rebuild for SERP benefit — but stale mismatched schema violates guidelines and feeds wrong text to AI crawlers. Fix: regenerate the JSON-LD from the 36 visible cards, dedupe, fix the garbled answer. (Per house rules: the visible .q-card-answer divs are source of truth.)

### H6. Sitemap conflicts
- `/audit-thanks` is in sitemap.xml but is `noindex` → GSC conflict. Remove it.
- Two live posts missing from sitemap: `/blog/walmart-vs-amazon-2026` and `/blog/how-to-launch-new-product-on-amazon`. Add both.
- `/free-audit` is `noindex, nofollow`, canonical-less, orphaned. If intentional (paid traffic only), at minimum change to `noindex, follow`; if it should rank, remove noindex and link it from the nav.

### H7. No Open Graph tags on blog posts; no og:image site-wide
Blog posts have zero OG tags → no link-preview cards on LinkedIn/Slack/iMessage, where agency content actually circulates. Article schema also missing `image` and `publisher.logo`. Fix: add og:title/description/url/image (1200×630) to the blog template and an `image` array to Article schema.

---

## MEDIUM

- **M1. /questions title tag is 81 characters** (limit 60 incl. suffix). Suggest: "Amazon & Walmart Agency FAQ | SellTru" (37). Some posts also drop the `| SellTru` suffix entirely (reduce-acos, how-to-advertise-on-walmart, tacos) — standardize.
- **M2. Blog index meta description 163 chars** — trim below ~155.
- **M3. Best-agencies post: agency names aren't headings.** Ranked entries render as styled divs; convert each to an `<h3>` (restyled to match) — the highest-leverage GEO fix on the site's most important commercial post.
- **M4. No dates/excerpts on blog index cards**; `dateModified` == `datePublished` on every post. Six "2026"-titled posts will decay in January. Add visible "Last updated," bump dateModified on real edits, establish a refresh cadence.
- **M5. Blog posts have no images** (cost post: 0, reduce-ACOS: 0). Add 2–3 redacted screenshots/diagrams per pillar post — Experience signal + image search asset.
- **M6. /amazon-marketing is 748 words** for the money page: no pricing anchor, no case-study excerpt, no FAQs. Expand.
- **M7. Fragmented entity graph:** Organization and LocalBusiness are two unlinked SellTru nodes; Service page re-declares Organization inline instead of `@id` reference; no BreadcrumbList outside blog posts.
- **M8. Agency-selection cluster crowding:** "best-amazon-ppc-agencies-2026" vs "top-rated...small-business" overlap heavily — differentiate the latter hard around sub-$1M sellers or fold it in.
- **M9. Sitemap hygiene:** 15 core pages missing lastmod, 14 share a bulk-backfilled date; changefreq/priority ignored by Google (safe to strip).
- **M10. Image CLS risk:** Squarespace-CDN badge images and blog proof screenshots missing width/height; consider self-hosting the two partner badges.
- **M11. Dead/unverified sameAs links:** connectively.us profile (HARO shut down Dec 2024 — likely dead, remove); verify Facebook/Instagram URLs.
- **M12. OG mismatches on homepage:** og:title differs from title tag; no og:image.

## LOW

- Two-hop redirect from `http://www.` — collapse to one hop.
- Missing security headers (X-Content-Type-Options, CSP, Referrer-Policy) — add via netlify.toml.
- llms.txt: one malformed URL (`/about#contact.` with fused period), lines 118–124 appended outside any H2 in three different bullet formats. Honest note from the skill's methodology: llms.txt is unproven as a citation lever — keep it tidy but don't invest further expecting rankings from it.
- Homepage: 2 of 10 images missing alt text; About meta description may truncate mid-word ("...and approa") — verify source.
- Claim drift: "$150M+ in marketplace sales" (llms.txt) vs "$150M+ in Amazon sales" (schema) — pick one phrasing everywhere.
- Unattributed stat in best-agencies post (Canopy "66.75%") — add source link.

---

## What's already working (don't touch)

- Titles on core pages all ≤60 chars incl. suffix (43/53/43/39/49/41); one H1 per page; correct self-canonicals; true-404 branded error page; robots.txt clean with AI crawlers allowed.
- Performance is very good: light pages (87KB HTML home), WebP images, textbook font loading, 180–330ms TTFB.
- Search-intent match is excellent on every audited page (listicle for "best agencies," direct cost answer for "cost," process how-to for "reduce ACOS").
- The cost post's "Short Answer" block (~150 words, number in first 40 words) is textbook AI-citability — replicate this pattern in every new post.
- The best-agencies post is the model: Person byline, disclosure, comparison table, operator-level criteria. Its pattern should become the site template.

---

## Recommended sequence

**Week 1 — quick wins (one edit session):** upload logo (C2) · remove /audit-thanks from sitemap + add 2 missing posts (H6) · fix /questions title tag (M1) · trim blog index meta (M2) · fix llms.txt malformed URL · fix garbled FAQ schema answer (part of H5).

**Week 2 — identity layer:** founder section on /about (C3) · Person bylines + author box on all posts (H3) · Upwork/SPN verification links + testimonials (H4) · og:image + OG tags on blog template (H7).

**Week 3 — architecture:** static header/footer render (C1) · clean-URL hrefs + .html 301s (H1) · regenerate /questions FAQPage from visible cards (H5).

**Week 4 — consolidation:** Walmart Connect merge + TACoS merge with 301s (H2) · expand /amazon-marketing (M6) · H3 headings on best-agencies post (M3).

**Leading indicators to watch in GSC (no re-audit needed):** impressions on Walmart Connect queries (should consolidate to one URL within ~3 weeks of the merge), crawl stats for .html variants (should fall after 301s), and clicks on the best-agencies post after the H3/byline changes.

**Not covered (needs credentials):** real Core Web Vitals field data, Search Console query data, and backlink profile. Connecting a free Google API key + GSC OAuth would unlock all three on the next run (`/seo google setup` in the skill, or connect Search Console here in Cowork).
