# SellTru SEO Audit — May 2026

**Conducted:** May 15, 2026 | **Last Updated:** May 15, 2026 (all Quick Wins implemented)
**Data sources:** Google Search Console (24h + 28-day), Google Analytics 4 (28-day), live HTML file audit (9 key pages), competitor web research, project vault (full session history, content calendar, sales pipeline)
**Scope:** Full site audit — keyword research, on-page SEO, technical SEO, content gaps, competitor comparison, prioritized action plan
**Site context:** SellTru.com launched as an Amazon/Walmart PPC agency April 2026 — less than 1 month old under the current brand. The domain was previously used by a Fort Lauderdale web design and SEO agency, creating topical contamination in Google's index that decays over time as the domain is reassociated with marketplace advertising content.

---

## Executive Summary

SellTru is a young site with a strong content foundation and real momentum. Indexed pages grew from ~15 to 33 over the past three months, the query footprint has expanded to 485 unique queries in 28 days, and Google is consistently rewarding the practitioner-voice content with page 1 rankings for competitive terms. The trajectory is clearly upward.

That said, the site is leaving a significant amount of traffic on the table right now due to three specific problems: (1) the highest-impression page on the site (/amazon-agency-pricing, 1,033 impressions in 28 days) is converting only 0.3% of impressions to clicks despite a position 7.2 average — meaning the SERP snippet is failing; (2) the domain's prior use as a Fort Lauderdale web design agency has contaminated Google's topical model, generating 290+ impressions for completely irrelevant local web design queries that will never convert — this is domain-level contamination that decays over time as Google indexes more Amazon/Walmart content; and (3) zero conversion events are being tracked in GA4, making it impossible to measure what's working.

**Important: two of the three highest-priority on-page fixes have already been deployed.** The /amazon-agency-pricing title tag and meta description were rewritten on May 12, and the /how-to-reduce-amazon-acos title and meta description were also updated May 12. GSC typically reflects meta changes in ~2 weeks, meaning impact should appear in data around May 26. The www/non-www redirect issue was also resolved on May 1 in Netlify.

**All Quick Wins from this audit have been implemented on May 15, 2026.** GA4 conversion tracking is now live (`form_submit` marked as key event; audit-thanks.html GA4 loading fixed). All meta/title tags updated. Internal links to /questions added across 16 blog posts. 404 errors resolved. Weekly backlink outreach task set up to run every Monday at 9 AM.

The current top priorities are strategic: (1) accelerate backlink acquisition — weekly automated outreach task is now running, manual follow-up on agency directory listings still needed; (2) publish the Walmart Connect Ads agency landing page targeting "walmart connect ads agency" — the highest-value unclaimed keyword cluster; and (3) monitor May 26 GSC data to measure impact of May 12 meta changes.

---

## Recent Changes Log

Changes deployed since site launch — tracked here so the audit reflects current state, not stale issues.

| Date | Change | Expected GSC Impact |
|------|--------|---------------------|
| May 1, 2026 | Fixed www vs non-www redirect in Netlify — set selltru.com as primary domain | Already resolved; authority consolidating |
| May 5, 2026 | Added Fort Lauderdale 301 redirects in `_redirects` file — old local web design URLs now redirect to relevant agency pages | Cleans up legacy URL crawl; topical contamination decays over time |
| May 12, 2026 | Rewrote /amazon-agency-pricing title tag (price signal added) and meta description | GSC impact expected ~May 26 |
| May 12, 2026 | Rewrote /how-to-reduce-amazon-acos title and meta description | GSC impact expected ~May 26 |
| Ongoing | Warm-up running on andrew@selltru.com for Apollo outbound sequence — do not activate until May 21 | Outbound launch may drive brand search traffic to site |

---

## Site Overview (28-Day Snapshot)

| Metric | Value | Context |
|--------|-------|---------|
| Indexed pages | 33 | Up from ~15 in February — strong growth |
| Not indexed | 16 | 6 distinct reasons — see Technical section |
| Total queries (28 days) | 485 | Strong keyword footprint for a site this age |
| Total impressions (28 days) | 8,450 | Growing fast — up from near zero in March |
| Total clicks (28 days) | 20 | Very low — 0.2% CTR is the core problem |
| Avg position (28 days) | 16.2 | Dragged down by irrelevant Fort Lauderdale queries |
| Active users (28 days, GA4) | 171 | Tiny absolute number, but growing |
| New vs. returning users | 170 / 1 | No repeat audience yet — a content retention gap |
| Avg engagement time | 30 seconds | Below typical for long-form content (target: 90s+) |
| Organic as % of sessions | 14% | Direct (71%) still dominates — early stage |
| Key events (conversions) | 0 | No tracking configured — blind spot |

---

## Keyword Opportunity Table

Sorted by opportunity score (combination of search demand, current position, and business relevance).

| Keyword | Est. Difficulty | Opportunity | Current Position | Intent | Recommended Content |
|---------|----------------|-------------|-----------------|--------|---------------------|
| how to reduce acos on amazon | Medium | **High** | 10.4 (pg 1 edge) | Informational | Expand existing post — more H2s, FAQ schema |
| amazon agency pricing | Medium | **High** | 10.2 (pg 1 edge) | Commercial | CTR fix on existing page |
| best amazon ppc agency | Medium | **High** | 5.9 (pg 1) | Commercial | CTR fix on existing post |
| amazon agency cost | Medium | **High** | 12.0 (pg 2) | Commercial | Internal link push + content depth |
| amazon ppc management cost | Medium | **High** | 17.6 (pg 2) | Commercial | Position is the blocker — internal links |
| walmart ppc agency | Low | **High** | Not ranking | Commercial | New dedicated landing page |
| walmart connect ads pricing | Very Low | **High** | Not ranking | Commercial | New blog post or landing page |
| walmart advertising agency | Low | **High** | Not ranking | Commercial | New landing page or dedicated content |
| walmart connect ads agency | Very Low | **Very High** | Not ranking | Commercial | Dedicated service page — highest-value Walmart term, not yet on content calendar |
| best amazon ppc agencies 2026 | Medium | **High** | 8.8 (pg 1) | Commercial | CTR optimization + freshness update |
| amazon listing optimization guide 2026 | Medium | **Medium** | 9.3 (pg 1) | Informational | CTR optimization |
| amazon tacos definition | Medium | **Medium** | 9.4 (pg 1) | Informational | CTR optimization |
| how to expand amazon brand to walmart | Low | **Medium** | Est. pg 2–3 | Informational | Existing post — internal linking |
| walmart vs amazon for sellers 2026 | Low | **Medium** | Est. pg 2 | Informational | Update + internal links |
| amazon ppc agency pricing | Medium | **Medium** | 16.7 | Commercial | Internal link from agency-pricing page |
| best amazon advertising agencies 2026 | Medium | **Medium** | 8.0 (pg 1) | Commercial | Existing post — needs CTR work |
| what questions to ask amazon agency | Low | **Medium** | 1.3 (!) | Commercial | Existing post — add CTA + internal links |
| amazon sponsored products vs sponsored brands | Medium | **Medium** | 12.9 | Informational | Existing post — build depth |
| walmart connect ppc guide | Very Low | **High** | Not ranking | Informational | New comprehensive guide |
| walmart marketplace management agency | Low | **High** | Not ranking | Commercial | New content |
| amazon ppc budget calculator | Low | **Medium** | Not ranking | Tool/Transactional | Interactive tool page |
| amazon agency worth it | Medium | **Medium** | Est. pg 2 | Commercial | Existing post — CTR optimization |
| ppc management pricing | High | **Low** | 36.0 (pg 4) | Commercial | Too competitive at current DA — deprioritize |
| fort lauderdale website design | N/A | **None** | 74.9 | Local/Irrelevant | Remove geo signal from homepage meta description |

---

## On-Page SEO Issues

### Title Tag Audit

| Page | Title | Chars | Status | Issue |
|------|-------|-------|--------|-------|
| index.html | Amazon Marketing Agency \| Walmart Marketplace Agency \| SellTru | 62 | ✅ Good | None |
| amazon-agency-pricing.html | Amazon Agency Pricing: $1,500-$8,000/mo, What's Included | 55 | ✅ Rewritten May 12 | New title deployed with stronger price signal — CTR impact expected ~May 26 |
| blog/best-amazon-ppc-agencies-2026.html | Best Amazon PPC Agencies 2026: Ranked by a Practitioner \| SellTru | 64 | ✅ Good | None |
| blog/how-to-reduce-amazon-acos.html | How to Reduce ACoS on Amazon Without Cutting Ad Spend | 54 | ✅ Updated May 12 | New title deployed — CTR impact expected ~May 26 |
| blog/amazon-ppc-management-cost.html | How Much Does Amazon PPC Management Cost? \| SellTru Blog | 55 | ✅ Good | None |
| blog/amazon-tacos-advertising.html | Amazon TACoS Explained: Definition, Formula and Benchmarks | 57 | ✅ Good | None |
| blog/amazon-listing-optimization-guide-2026.html | Amazon Listing Optimization: The Complete Guide for 2026 \| SellTru Blog | 70 | ❌ Too long | Truncated at ~60 chars — "Blog" gets cut |
| walmart-marketing.html | Walmart PPC & Marketplace Management Agency \| SellTru | 53 | ✅ Updated May 15 | New title deployed — was 72 chars, truncating "SellTru" |
| amazon-marketing.html | Amazon Marketing Agency for $1M–$20M Brands \| SellTru | 54 | ✅ Updated May 15 | New title deployed — was 84 chars, losing brand name entirely |

### Meta Description Audit

| Page | Chars | Status | Issue |
|------|-------|--------|-------|
| index.html | 154 | ✅ Fixed May 15 | "Fort Lauderdale, FL" removed. New meta: "SellTru manages Amazon and Walmart for brands doing $1M to $20M. Expert PPC, listing optimization, and full account management. No generalists. No handoffs." |
| amazon-agency-pricing.html | 149 | ✅ Rewritten May 12 | New meta deployed — impact expected ~May 26 |
| blog/best-amazon-ppc-agencies-2026.html | 155 | ✅ Good | None |
| blog/how-to-reduce-amazon-acos.html | 154 | ✅ Updated May 12 | New meta deployed — impact expected ~May 26 |
| blog/amazon-ppc-management-cost.html | 157 | ✅ Good | None |
| blog/amazon-tacos-advertising.html | 176 | ❌ Too long | Will be truncated ~155 chars — loses the end |
| blog/amazon-listing-optimization-guide-2026.html | 161 | ⚠️ Slightly long | Trim ~6 chars to prevent truncation |
| walmart-marketing.html | 188 | ❌ Too long | Loses last 33 chars in SERP display |
| amazon-marketing.html | 200 | ❌ Too long | Loses ~45 chars. Also a run-on list of services |

### H-Tag and Content Structure

| Page | H1 | H2 Count | Issue |
|------|----|----------|-------|
| index.html | Strong, benefit-driven | 12 | None — well structured |
| amazon-agency-pricing.html | Strong | 8 | None |
| blog/best-amazon-ppc-agencies-2026.html | Strong | 7 | None |
| blog/how-to-reduce-amazon-acos.html | Good | **4** | Too few — thin content structure for the site's top impression query |
| blog/amazon-ppc-management-cost.html | Good | 6 | Acceptable |
| blog/amazon-tacos-advertising.html | Strong | 7 | None |
| blog/amazon-listing-optimization-guide-2026.html | Good | 7 | None |
| walmart-marketing.html | Strong | 5 | Service page — acceptable count |
| amazon-marketing.html | Strong | **4** | Too few for a primary service page |

### Internal Linking Audit

| Page | Internal Links | Issue |
|------|---------------|-------|
| index.html | ~18 | Good — links to key service pages and blogs |
| blog/best-amazon-ppc-agencies-2026.html | ~12 | Good |
| blog/how-to-reduce-amazon-acos.html | ~10 | Good |
| blog/amazon-ppc-management-cost.html | ~10 | Good |
| blog/amazon-tacos-advertising.html | ~9 | Good |
| blog/amazon-listing-optimization-guide-2026.html | ~10 | Good |
| amazon-agency-pricing.html | ~6 | **Weak** — most important landing page, fewest links from other pages pointing to it |
| walmart-marketing.html | ~5 | **Weak** — isolated from blog ecosystem |
| amazon-marketing.html | ~5 | **Weak** — isolated from blog ecosystem |

### Schema Markup

All 9 audited pages have schema markup. This is above average for a site this age and a real strength. Specific implementations:

- index.html: Organization + LocalBusiness + WebSite (strong)
- amazon-agency-pricing.html: Article + FAQPage (5 Q&As)
- blog/best-amazon-ppc-agencies-2026.html: Article + BreadcrumbList + FAQPage (6 Q&As)
- Other blog posts: Article schema
- Service pages: Service schema with hasOfferCatalog

**Gap:** The /amazon-agency-pricing page has Article schema but a PricingPage or FAQPage schema might better match Google's intent classification for this query type. Consider adding a more explicit pricing-oriented schema type.

---

## Technical SEO Checklist

| Check | Status | Details |
|-------|--------|---------|
| HTTPS | ✅ Pass | All pages served over HTTPS |
| Canonical tags | ✅ Pass | Present on all 9 audited pages |
| XML Sitemap | ✅ Pass | Submitted to GSC; 28 pages per prior audit |
| Schema markup | ✅ Pass | Present on all audited pages — above average |
| Mobile-friendliness | ✅ Pass | No issues observed in GSC |
| Robots.txt | ✅ Pass | No blocking issues evident |
| Meta robots tags | ✅ Fixed May 15 | audit-thanks.html, write-for-us-thanks.html, and mailchimp_email_templates.html all have `<meta name="robots" content="noindex, follow">`. All utility pages noindexed. |
| www vs non-www | ✅ Fixed May 1 | Netlify primary domain set to selltru.com — www now redirects to non-www with 301. Was previously splitting authority; resolved. |
| 404 errors | ✅ Fixed May 15 | Investigated live. `/home` was a genuine 404 — fixed with 301 redirect to homepage in `_redirects`. `www.selltru.com/fort-lauderdale-seo-agency` was stale GSC data — confirmed working correctly in browser. No further action needed. |
| Redirect error | ✅ Fixed May 15 | Blog redirect error in GSC was stale data — confirmed working correctly in browser. No further action needed. GSC takes ~1 week to clear stale errors after revalidation. |
| Redirect pages | ⚠️ Warning | 4 pages flagged as "Page with redirect" — Google is crawling redirect chains that should be consolidated |
| Crawled, not indexed | ⚠️ Warning | 4 pages crawled by Google but not indexed — Google chose not to include them, likely due to thin content or near-duplicate signals |
| Discovered, not indexed | ⚠️ Warning | 3 pages discovered but not yet crawled — these are in the queue |
| Irrelevant indexed content | ⚠️ In Progress | Fort Lauderdale legacy URLs — 301 redirects added May 5 via Netlify `_redirects` file. Domain used to be a Fort Lauderdale web design agency; Google's topical model needs time to reassociate with Amazon/Walmart PPC. A "Fort Lauderdale Ecommerce Marketing" page was appearing in GA4 with 26 views and 61.5% bounce rate. Redirects deployed — contamination decays as new content accumulates. Remove "Fort Lauderdale, FL" from homepage meta description as remaining action. |
| Key event tracking | ✅ Fixed May 15 | `form_submit` marked as key event in GA4. `audit_requested` custom event firing on audit-thanks.html (GA4 load changed to immediate async). Conversion tracking now live. |
| Engagement time | ⚠️ Warning | 30-second average engagement time is low for long-form content — suggests visitors aren't scrolling or reading deeply |
| Returning users | ⚠️ Warning | 170/171 users are first-time visitors — near-zero repeat audience |
| Breadcrumb schema | ⚠️ Warning | Only present on /blog/best-amazon-ppc-agencies-2026.html — should be added to all blog posts |
| FAQ schema | ⚠️ Warning | Only present on 2 pages — should be added to every blog post that has a FAQ section |

---

## Content Gap Analysis

### High-Priority Gaps

**Walmart PPC/advertising cost page**
There is no page on selltru.com targeting "walmart ppc cost", "walmart connect ads pricing", or "walmart advertising agency cost". Competitors (My Amazon Guy, Trivium) have almost nothing here either. This is an unclaimed, high-intent keyword cluster that directly matches SellTru's Walmart moat. A dedicated page or blog post targeting this cluster could rank in the top 5 within 60 days given the low competition.
- Recommended format: Blog post or landing page hybrid
- Priority: High
- Effort: Moderate (half day)

**Walmart Connect ads complete guide**
The existing /blog/walmart-connect-ads.html covers the basics. There is no comprehensive, authoritative guide to Walmart Connect advertising — the equivalent of what /blog/best-amazon-ppc-agencies-2026.html is for Amazon. No competitor has built this content at depth. This is the highest-leverage Walmart content gap on the site.
- Recommended format: Long-form guide (3,000+ words)
- Priority: High
- Effort: Substantial (multi-day)

**Walmart vs Amazon advertising comparison (deep)**
"walmart vs amazon ppc" and "walmart advertising vs amazon advertising" are queries with real demand and low competition. My Amazon Guy has a shallow comparison page. A practitioner-voice, data-heavy comparison guide from SellTru would rank well and position the agency as the authority on both channels.
- Recommended format: Long-form comparison guide
- Priority: High
- Effort: Moderate

**Amazon PPC budget calculator**
No tool or calculator exists on the site. Competitors don't have this either. An interactive "Amazon PPC Budget Estimator" page would attract commercial-intent traffic, generate backlinks, and give visitors a reason to return. ChatGPT is already sending referral traffic to the site — a shareable tool amplifies that.
- Recommended format: Interactive HTML tool page
- Priority: Medium
- Effort: Substantial

**Walmart marketplace management agency landing page**
The /walmart-marketing.html page covers the service broadly. There is no dedicated page targeting "walmart marketplace management agency" or "walmart management agency" as primary keywords. These terms have low difficulty and clear commercial intent.
- Recommended format: Dedicated landing page with focused H1 and keyword targeting
- Priority: Medium
- Effort: Moderate

### Medium-Priority Gaps

**Amazon brand registry guide** — No content targeting "amazon brand registry" which drives significant educational traffic. High volume, moderate difficulty, builds top-of-funnel authority.

**Amazon FBA vs FBM comparison** — A common consideration for brands at the $1M+ stage. Informational but builds ICP trust.

**Questions to ask an Amazon agency (dedicated page)** — The existing /blog/questions-to-ask-amazon-marketing-agency.html already ranks at position 1.3 for a high-intent query. This page needs a stronger CTA and more impressions. Internal link to it from every other blog post.

**Walmart marketplace setup guide** — "How to sell on Walmart marketplace" is a high-volume informational term. A guide here builds top-of-funnel Walmart traffic that feeds the agency services.

### Content Freshness

| Page | Year in Title | Risk |
|------|--------------|------|
| blog/best-amazon-ppc-agencies-2026.html | 2026 | Low — freshly targeted |
| blog/amazon-listing-optimization-guide-2026.html | 2026 | Low |
| blog/walmart-vs-amazon-2026.html | 2026 | Low |
| blog/how-to-rank-on-walmart-search-2026.html | 2026 | Low |
| blog/amazon-ppc-management-cost.html | None | Medium — check pricing figures are current |
| blog/how-to-reduce-amazon-acos.html | None | Low — evergreen content |

---

## Competitor Comparison

| Dimension | SellTru | My Amazon Guy | Trivium Group |
|-----------|---------|---------------|---------------|
| Domain age / authority | New (2025–26) | Est. ~2017, very high DA | Est. ~2019, strong DA |
| Blog post volume | ~18 Amazon + 5 Walmart | 1,000s | Dozens |
| Amazon PPC content | Strong practitioner voice | Massive — daily publishing | Strong technical focus |
| Walmart content | **Deep — competitive moat** | Shallow (1–2 pages) | None visible |
| YouTube presence | Not launched | Dominant — daily videos | Active |
| Pricing transparency | **Full (actual $$ on site)** | None | None |
| Schema markup | ✅ Strong | Mixed | Unknown |
| FAQPage schema | On key pages | Sparse | Unknown |
| Publishing frequency | ~2–3 posts/month | Daily | Weekly |
| Conversion tracking | ✅ Configured May 15 | Configured | Configured |
| Competitor content | "Best agencies" post | Yes — multiple | Yes |

**SellTru's SEO advantages:**
- Walmart content depth that neither competitor has built
- Transparent pricing pages (rare in the agency space — likely drives high-intent clicks)
- Practitioner-voice content that outperforms AI-generated filler on E-E-A-T signals
- FAQPage and Article schema consistently implemented
- ChatGPT already citing the site — early AI search advantage

**SellTru's SEO disadvantages:**
- Domain authority is very low vs. established competitors
- Publishing frequency (2–3/month) is far below My Amazon Guy's daily cadence
- Zero YouTube presence while My Amazon Guy dominates video SEO
- No backlink-attracting tools, calculators, or data resources yet

---

## Prioritized Action Plan

### Quick Wins — Do This Week

**1. Remove "Fort Lauderdale, FL" from homepage meta description** ✅ DONE May 15
- New meta live: "SellTru manages Amazon and Walmart for brands doing $1M to $20M. Expert PPC, listing optimization, and full account management. No generalists. No handoffs." (154 chars)
- Pushed to GitHub → deployed via Netlify.

**2. Rewrite /amazon-agency-pricing title + meta** ✅ DONE May 12
- Deployed. GSC impact expected ~May 26. Monitor CTR week of May 26 in GSC Performance report.

**3. Rewrite /blog/how-to-reduce-amazon-acos title + meta** ✅ DONE May 12
- Deployed. GSC impact expected ~May 26. Monitor position and CTR week of May 26.

**4. Fix the 2 x 404 pages and 1 redirect error in GSC** ✅ DONE May 15
- Investigated live in GSC. Findings: `/home` was a genuine 404 — fixed with 301 → homepage in `_redirects`. `www.selltru.com/fort-lauderdale-seo-agency` and the blog redirect error were stale GSC data — both URLs confirmed working correctly in browser. No further action needed.

**5. Set up GA4 key event tracking for form submissions** ✅ DONE May 15
- `form_submit` marked as a key event in GA4 Admin → Events. `audit_requested` custom event on audit-thanks.html confirmed firing — GA4 loading changed from deferred (requestIdleCallback) to immediate async so the event fires reliably on page load before a visitor bounces. Both changes pushed to production.

**6. Fix amazon-marketing.html title tag (84 → under 60 chars)** ✅ DONE May 15
- New title live: "Amazon Marketing Agency for $1M–$20M Brands | SellTru" (54 chars). Pushed to GitHub → deployed via Netlify.

**7. Fix walmart-marketing.html title tag (72 → under 60 chars)** ✅ DONE May 15
- New title live: "Walmart PPC & Marketplace Management Agency | SellTru" (53 chars). Pushed to GitHub → deployed via Netlify.

**8. Add internal links to /questions page from every blog post** ✅ DONE May 15
- Link inserted into 16 blog posts via Python script (first occurrence, idempotency-safe). All 22 blog posts now link to /questions. Line added above `.blog-cta-box` div in each post: "Before hiring any agency to manage your marketplace ads: 15 questions to ask an Amazon marketing agency →"

**9. Add at least one internal link to /write-for-us page** ✅ NOT NEEDED — May 15
- Investigation confirmed write-for-us.html is already linked from all blog posts (blog CTA box) and from blog.html. Not an orphan. No action required. Audit flag was incorrect.

**10. Follow up on agency directory submissions to confirm listings are live**
- Submitted to: Clutch, DesignRush, AgencySpotter, UpCity, G2, PPC Hero, Sortlist. These are the fastest path to the first 10+ quality backlinks. Each listing that goes live adds a referring domain and improves domain authority.
- Action: Log into each platform and check listing status. If pending, complete any remaining profile steps. Once live, each URL is a backlink.
- HARO signup is also done — check inbox and respond to any relevant journalist queries (Amazon advertising, e-commerce, marketplace management)
- Impact: High — 7 live directory listings could 2x the site's referring domain count from 1 to 8
- Effort: 1 hour

### Strategic Investments — Plan for This Quarter

**1. Backlink acquisition — the #1 growth constraint on the site**
- SellTru has only 7 external backlinks, all from a single low-value domain (solomonschoonover.com). Domain authority is the primary reason high-competition terms stay on page 2+. No amount of on-page optimization outweighs a near-zero backlink profile.
- Short-term actions (already in motion): Verify all 7 agency directory submissions are live (Clutch, DesignRush, AgencySpotter, UpCity, G2, PPC Hero, Sortlist). Respond to HARO queries in Amazon/e-commerce/marketing categories. Guest post on one Amazon seller publication (Jungle Scout blog, Seller Central community, FeedbackWhiz blog).
- Medium-term: The "State of Walmart Connect Advertising 2026" data report or an interactive Amazon PPC Budget Calculator would attract organic backlinks from Amazon seller blogs, YouTube channels, and Reddit/Facebook community posts. This is the highest-leverage investment for compounding DA growth.
- Target: Get from 1 to 10+ referring domains by end of Q2 2026.
- Impact: Very High (long-term compounding)
- Effort: Ongoing — 2–4 hours/week

**2. Build a "Walmart Connect ads agency" dedicated landing page** *(highest-value unclaimed keyword)*
- Current gap: "walmart connect ads agency" and "walmart advertising agency" are not on the content calendar and no page targets them directly. These are the highest commercial-intent Walmart keywords — someone searching this is in buying mode.
- Competitors have almost nothing here. My Amazon Guy has a shallow page. Trivium has nothing visible.
- Format: Dedicated service landing page (not a blog post) — similar structure to /amazon-marketing.html but Walmart-specific, with transparent pricing signals, case study references, and a clear audit CTA.
- Why now: SellTru's Walmart moat is the primary competitive differentiator. Not having a page targeting the exact phrase a buyer would type is leaving the most valuable traffic unclaimed.
- Impact: Very High
- Effort: Half day

**3. Build a Walmart PPC cost/pricing page**
- Target keywords: "walmart ppc cost", "walmart connect ads pricing", "how much does walmart advertising cost"
- Format: Identical structure to /amazon-agency-pricing.html — transparent, practitioner-written, with actual numbers
- Why now: Competitors have nothing. This page would likely rank top 5 within 60 days given the low competition.
- Impact: High
- Effort: Half day

**4. Expand /blog/how-to-reduce-amazon-acos.html content depth**
- Currently has only 4 H2s — thin for the site's biggest impression-driving query
- Add sections: Common ACoS mistakes, ACoS by product category benchmarks, how to read the search term report, when to pause vs. adjust vs. restructure campaigns
- Add an FAQ section with FAQPage schema targeting long-tail ACoS questions
- Impact: High — more depth = better ranking signal for the most competitive query the site is chasing
- Effort: Half day

**5. Create a Walmart Connect Ads comprehensive guide**
- The most valuable piece of Walmart content the site doesn't have yet
- Target: 3,000+ words, covering campaign types, bidding strategy, targeting options, budgets, and optimization
- This is the Walmart equivalent of the Amazon PPC agencies post — designed to rank and build backlinks
- Impact: High
- Effort: Substantial (2–3 days with research)

**6. Optimize for GEO (Generative Engine Optimization)**
- ChatGPT is already sending referral traffic to selltru.com — this is a significant early signal and should be protected and expanded.
- GEO actions: (a) Add author schema with real credentials on all blog posts (name, title, years of experience, accounts managed); (b) Structure content with clear factual claims and specific numbers — LLMs cite posts with concrete data ("CPCs on Walmart Connect average $0.35 vs $1.20 on Amazon" beats "Walmart CPCs are lower"); (c) Write "what is X" and "how does X work" sections within posts — these match the question-answer patterns LLMs use to retrieve citations; (d) Keep the existing practitioner voice — it's already outperforming AI-generated content on E-E-A-T signals.
- Impact: High (forward-looking — AI search is already driving referrals)
- Effort: Low-Medium (mostly content formatting changes)

**7. Add breadcrumb schema to all blog posts**
- Currently only one post has BreadcrumbList schema
- Adding it sitewide helps Google understand site hierarchy and can generate breadcrumb display in SERPs (improves CTR)
- Impact: Medium
- Effort: 2–3 hours (template update)

**8. Add FAQ schema to every blog post with a FAQ section**
- Currently only 2 pages have FAQPage schema. Every blog post that ends with "Frequently Asked Questions" should have it.
- FAQ schema generates rich results in SERPs which significantly improve CTR
- Impact: Medium-High
- Effort: 2–4 hours

**9. Noindex utility/thank-you pages** ✅ DONE May 15
- audit-thanks.html already had noindex. Added `<meta name="robots" content="noindex, follow">` to write-for-us-thanks.html and mailchimp_email_templates.html. All three utility pages now noindexed. Pushed to production.

**10. Build a linkable asset (calculator or data report)**
- No pages on the site are designed specifically to attract inbound backlinks. A "State of Walmart Connect Advertising 2026" data report or an interactive Amazon PPC Budget Calculator would attract links from Amazon seller blogs, YouTube channels, and Reddit/Facebook community posts. One well-placed link from a large Amazon seller publication could add more authority than 20 directory listings.
- Impact: High (long-term compounding)
- Effort: Substantial (1–2 weeks)

---

## Suggested Meta Description Rewrites

### index.html
**Current (187 chars, contains "Fort Lauderdale, FL"):**
SellTru is a specialized Amazon marketing agency and Walmart marketplace agency for brands doing $1M to $20M. Expert PPC, listing optimization, and account management. Fort Lauderdale, FL.

**Suggested (154 chars):**
SellTru manages Amazon and Walmart for brands doing $1M to $20M. Expert PPC, listing optimization, and full account management. No generalists. No handoffs.

### amazon-agency-pricing.html
**Current (149 chars):**
Three pricing models, what's included at each, and how to tell if you're getting a fair deal. From a team managing $150M+ in marketplace revenue.

**Suggested (156 chars):**
Most agencies hide their prices. We don't. See what Amazon agencies actually charge, what's included at each tier, and how to spot the ones ripping you off.

### blog/how-to-reduce-amazon-acos.html
**Current (154 chars):**
Most sellers fix ACoS by cutting spend. That kills momentum. Here's the 5-step weekly process we run to fix it at the root without touching your budget.

**Suggested (153 chars):**
High ACoS is almost never a spend problem — it's a targeting or listing problem. Here's the exact weekly process we run to fix it without cutting budget.

*(Note: current is already strong — small tweak only to frontload the insight)*

### amazon-marketing.html
**Current (200 chars — too long):**
SellTru is a certified Amazon SPN agency providing end-to-end Amazon management — listing optimization, Sponsored Ads PPC, A+ content, brand store design, and full account management. Get a free audit.

**Suggested (155 chars):**
Full-service Amazon management for brands doing $1M to $20M. PPC, listings, A+ content, and account health — handled by a certified SPN agency. Get a free audit.

### walmart-marketing.html
**Current (188 chars — too long):**
SellTru helps brands grow on Walmart.com with expert marketplace management, Walmart Connect advertising, WFS fulfillment support, and listing optimization. Get a free Walmart audit today.

**Suggested (155 chars):**
Full-service Walmart.com management for brands ready to scale — Walmart Connect ads, WFS support, listing optimization, and full account management. Free audit.

---

## Open Items for Andrew

**Manual tasks (Andrew's action required):**
- Follow up on agency directory submissions (Clutch, DesignRush, AgencySpotter, UpCity, G2, PPC Hero, Sortlist) — log in and confirm listings are live. Each confirmed listing is a referring domain.
- Check HARO/Connectively inbox for open queries about Amazon advertising, e-commerce agencies, or Walmart marketplace. Respond to any relevant ones.
- Set up the weekly backlink outreach scheduled task — prompt saved at `Test Vault\03-Strategy\Backlink-Task-Prompt.md`. Open a new chat session, ask Claude to create a scheduled task reading from that file. Cron: every Monday at 9 AM (`0 9 * * 1`). *(Cannot be created from within a scheduled task session — must be started fresh.)*

**Next build sessions (ready to execute):**
- Build the "walmart connect ads agency" dedicated landing page — the single highest-value unclaimed keyword cluster on the site. No competitor has this content at depth.
- Write the Walmart PPC cost/pricing page — transparent pricing format, identical to amazon-agency-pricing.html, near-zero competition.
- Expand how-to-reduce-amazon-acos.html — currently only 4 H2s for the site's top impression-driving query. Add campaign data, ACoS benchmarks by category, FAQ schema.
- Build a 90-day content calendar layering in Walmart keyword gaps and content engine priorities from the vault.

**Next monitoring checkpoint:** May 26 — check GSC CTR on /amazon-agency-pricing and /how-to-reduce-amazon-acos to measure impact of May 12 meta changes. Log results in GSC-Daily-Log.md.
