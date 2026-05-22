# SellTru Homepage CRO + SEO Optimization Plan
*Created: 2026-05-22 | Based on Microsoft Clarity data (Last 30 days)*

---

## What We Found — Clarity Data Summary

### Device Split
- **Desktop (PC): 83.66%**
- **Mobile: 16.34%**

Takeaway: Optimize for desktop first. Target audience ($1M+ brand owners) is researching at their desks, not on their phones. Mobile should not be deprioritized entirely, but desktop is the primary session.

---

### Homepage (index.html) — Click Behavior

- **Total sessions tracked:** ~60
- **Dead clicks:** 13.07% (20 sessions clicking unresponsive elements)
- **Most-clicked element:** Nav links / Contact CTA — 32% of tracked visitors clicked a "Contact" or "Get Free Audit" CTA **without scrolling far down the page first**

Key observation: A meaningful chunk of visitors are arriving with intent — they're clicking the CTA in the nav or hero almost immediately. They want to take action. The problem is where they land.

---

### About.html — The Conversion Funnel Audit

- **Page views (last 30 days): 4**
- **Total clicks: 6**
- **Scroll depth:**
  - 5%–15%: 4/4 visitors (100%), no drop-off
  - 20%–95%: 3/4 visitors (75%), flat — one visitor dropped off early
  - 100%: 0/4 visitors (0%) — nobody reached the very bottom

**The finding:** 3 of 4 visitors who landed on about.html scrolled 95% of the way down. They saw the contact form. But **zero form interactions appear in the click data.** No input fields, no submit button — nothing. The form is being seen but not filled out.

**Root cause:** about.html gets almost no traffic (4 views in 30 days). The homepage CTAs point there, but it's not a conversion page — it's a brand/story page. Visitors arrive expecting a form and get a mission statement first. The context switch kills the conversion.

---

## The Core Problem

The conversion path is broken in two places:

1. **Homepage CTAs send people to about.html** instead of directly into a form
2. **about.html is not a conversion page** — it's a brand page with a form buried at the 90%+ scroll depth

32% of homepage visitors are clicking CTA buttons with purchase intent. They're going to a page that gets 4 views a month and converts at 0% in the data we have.

---

## Optimization Plan — Prioritized

### Priority 1: Modal Audit Form on Homepage (Highest Impact)
**What:** Replace the about.html redirect on all "Get Free Audit" / "Work With Us" / "Get Started" CTA clicks with a modal that pops the form inline on the homepage.

**Why:** 32% of tracked visitors are clicking the CTA directly. They want to take action now. A modal removes the redirect friction entirely — the visitor never leaves the page. This is the single highest-leverage change on the site.

**Scope:**
- Build the modal HTML + CSS (matches site design system)
- Wire up the Formspree form submission inside the modal
- Update all CTA buttons on index.html to trigger the modal instead of `href="about.html#contact"`
- Keep about.html intact — it still has value for SEO and brand credibility

**Success signal:** Clarity shows click events on the form submit button inside the modal.

---

### Priority 2: Fix Dead Clicks (13.07% / 20 Sessions)
**What:** Identify exactly which elements are receiving clicks that don't respond. These are either visual elements that look clickable but aren't, or broken links.

**Why:** 1 in 8 visitors is clicking something dead. That's a UX failure that erodes trust and wastes high-intent sessions.

**How to identify:** In Clarity → Heatmaps → Click → filter by "Dead clicks" segment. Look at which elements accumulate dead clicks.

**Common culprits on this site:**
- Case study cards (images or labels that look linked)
- Section headings with no anchor
- Logo or badge images

**Fix:** Add `cursor: pointer` + link behavior, or make clear they're not clickable.

---

### Priority 3: FAQPage JSON-LD Schema on Homepage
**What:** Add `FAQPage` structured data to the existing FAQ accordion section on index.html.

**Why:** Pure SEO upside with zero UX change. Google can surface the Q&As directly in search results as rich snippets. Also improves visibility with LLM-based search (ChatGPT, Perplexity, Claude.ai) which uses structured data for retrieval. First ChatGPT-sourced lead (BRA Cookware, 2026-05-19) confirms this channel is producing.

**Scope:** Add ~20 lines of JSON-LD `<script type="application/ld+json">` to the `<head>` of index.html. No visual change.

---

### Priority 4: Sticky / Floating CTA on Blog Posts
**What:** Add a sticky bottom bar or floating CTA button to all blog posts that reads something like "Get a Free Amazon PPC Audit →"

**Why:** The blog is producing traffic (AI Storefront post: 38 visits, no conversion mechanism). Blog readers are the most qualified inbound traffic — they came looking for expertise. Giving them a frictionless way to convert while they're reading is a big missed opportunity.

**Scope:** Add a sticky `<div>` to blog post template with the modal trigger. One implementation, applies to all posts.

---

### Priority 5: Evaluate Hero Scroll Hook (Lower Priority — More Data Needed)
**What:** Potentially change the hero section CTA copy or add a scroll indicator to encourage visitors to read before clicking.

**Why this is lower priority:** The Clarity data showed 32% of visitors clicked Contact directly without scrolling. That's actually a good sign — high intent. We don't want to slow those people down. The scroll hook change only matters if low-intent visitors are bouncing early without engaging. We need more session recordings to confirm that's happening before we change copy.

**Hold until:** Clarity shows scroll depth < 20% for a meaningful percentage of sessions.

---

## What We Are NOT Doing (Yet)

- **Changing hero copy** — current copy is working for high-intent visitors
- **Redesigning about.html** — low traffic, not the bottleneck
- **Mobile-first redesign** — 83.66% desktop audience; mobile is not the priority
- **Scroll hook gating** — no data yet that the problem is low-intent bounce vs. broken conversion path

---

## Implementation Order

| # | Change | Effort | Impact |
|---|--------|--------|--------|
| 1 | Modal audit form on homepage | Medium | Very High |
| 2 | Fix dead clicks | Low | Medium |
| 3 | FAQPage schema on index.html | Low | Medium (SEO) |
| 4 | Sticky CTA on blog posts | Low | Medium |
| 5 | Scroll hook / hero copy eval | — | Hold |

---

## Open Questions

- What are the dead-click elements specifically? (Need Clarity dead-click filter)
- Is the Formspree form on about.html actually receiving submissions that aren't reflected in Clarity? (Check Formspree dashboard)
- Are blog visitors converting at all currently? (No mechanism in place to measure)

---

## Notes

- Site traffic source breakdown not yet pulled — need GSC + Clarity traffic source data to confirm what % is LLM-driven vs. organic vs. direct
- SEO monitoring checkpoint: **May 26** — check GSC CTR on `/amazon-agency-pricing` and `/how-to-reduce-amazon-acos`
- BRA Cookware inbound lead (2026-05-19) confirmed as first ChatGPT-sourced lead — validates LLM SEO strategy
