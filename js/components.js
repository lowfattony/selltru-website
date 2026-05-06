/**
 * SellTru Web Components -- components.js
 *
 * Defines <selltru-header> and <selltru-footer> custom elements.
 * Loaded synchronously (no defer) in <head> so both elements are
 * registered before the browser parses them in <body>, meaning
 * connectedCallback fires during parsing -- before main.js runs.
 */

/* --- Shared SVG strings ----------------------------------------- */

const LOGO_NAV = `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
  <rect x="1"  y="20" width="7"  height="13" rx="2.5" fill="#FF6B35"/>
  <rect x="10" y="13" width="7"  height="20" rx="2.5" fill="#1A56DB"/>
  <rect x="19" y="6"  width="7"  height="27" rx="2.5" fill="white"/>
  <rect x="28" y="2"  width="5"  height="31" rx="2"   fill="rgba(255,255,255,0.55)"/>
</svg>`;

const LOGO_FOOTER = `<svg width="30" height="30" viewBox="0 0 34 34" fill="none" aria-hidden="true">
  <rect x="1"  y="20" width="7"  height="13" rx="2.5" fill="#FF6B35"/>
  <rect x="10" y="13" width="7"  height="20" rx="2.5" fill="#1A56DB"/>
  <rect x="19" y="6"  width="7"  height="27" rx="2.5" fill="white"/>
  <rect x="28" y="2"  width="5"  height="31" rx="2"   fill="rgba(255,255,255,0.55)"/>
</svg>`;

const ICON_LINKEDIN = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

const ICON_FACEBOOK = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;

const ICON_INSTAGRAM = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;

const ICON_SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

/* --- Active nav helper ------------------------------------------ */

function activeClass(href) {
  const path = window.location.pathname;
  const clean = path.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const hClean = href.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (hClean === '/blog') {
    return (clean === '/blog' || path.startsWith('/blog/')) ? ' active' : '';
  }
  return clean === hClean ? ' active' : '';
}

/* --- <selltru-header> ------------------------------------------- */

class SellTruHeader extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
<header class="nav" role="banner">
  <div class="container">
    <div class="nav-inner">
      <a class="nav-logo" href="/index.html" aria-label="SellTru home">
        ${LOGO_NAV}
        <span class="nav-logo-text">SELL<span>TRU</span></span>
      </a>
      <nav class="nav-links" role="navigation" aria-label="Main navigation">
        <a class="nav-link${activeClass('/amazon-marketing.html')}" href="/amazon-marketing.html">Amazon</a>
        <a class="nav-link${activeClass('/walmart-marketing.html')}" href="/walmart-marketing.html">Walmart</a>
        <a class="nav-link${activeClass('/blog.html')}" href="/blog.html">Blog</a>
        <a class="nav-link${activeClass('/about.html')}" href="/about.html">About</a>
        <a class="nav-link" href="/about.html#contact-form">Contact</a>
      </nav>
      <a class="nav-cta" href="/about.html#contact-form">Get Free Audit</a>
      <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="nav-mobile" aria-label="Mobile navigation">
    <a href="/amazon-marketing.html">Amazon Marketing</a>
    <a href="/walmart-marketing.html">Walmart Marketing</a>
    <a href="/blog.html">Blog</a>
    <a href="/about.html">About</a>
    <a href="/about.html#contact-form" class="nav-cta">Get Your Free Audit &rarr;</a>
  </div>
</header>

<div class="email-bar" id="email-bar" role="complementary" aria-label="Free checklist offer" hidden>
  <div class="email-bar-inner">
    <div class="email-bar-copy">
      <span class="email-bar-label">Free Download</span>
      <span class="email-bar-text">Get the Amazon Audit Checklist we use on every account we take over.</span>
    </div>
    <form class="email-bar-form" id="email-bar-form" novalidate>
      <input type="email" name="email" class="email-bar-input" placeholder="Your work email" required autocomplete="email">
      <button type="submit" class="email-bar-btn">Send It</button>
    </form>
    <button class="email-bar-dismiss" id="email-bar-dismiss" aria-label="Dismiss">&times;</button>
  </div>
</div>

<form name="email-capture" data-netlify="true" hidden>
  <input type="email" name="email">
  <input type="hidden" name="source">
</form>`;
  }
}

/* --- <selltru-footer> ------------------------------------------- */

class SellTruFooter extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="nav-logo" href="/index.html" aria-label="SellTru home">
          ${LOGO_FOOTER}
          <span class="nav-logo-text">SELL<span>TRU</span></span>
        </a>
        <p class="footer-brand-desc">The Amazon marketing agency and Walmart marketplace agency for brands doing $1M to $20M. Fort Lauderdale, FL. Serving brands nationwide.</p>
        <div class="footer-social" aria-label="Social media">
          <a href="https://linkedin.com/company/selltru" target="_blank" rel="noopener" aria-label="LinkedIn">${ICON_LINKEDIN}</a>
          <a href="https://facebook.com/selltru" target="_blank" rel="noopener" aria-label="Facebook">${ICON_FACEBOOK}</a>
          <a href="https://instagram.com/selltru" target="_blank" rel="noopener" aria-label="Instagram">${ICON_INSTAGRAM}</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <a href="/amazon-marketing.html">Amazon Marketing</a>
        <a href="/amazon-marketing.html#listing-optimization">Listing Optimization</a>
        <a href="/amazon-marketing.html#ppc">Amazon PPC &amp; Ads</a>
        <a href="/walmart-marketing.html">Walmart Marketing</a>
        <a href="/walmart-marketing.html#walmart-ads">Walmart Connect Ads</a>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <a href="/blog.html">Blog</a>
        <a href="/questions.html">FAQ</a>
        <a href="/lead-magnet.html">Free Audit Checklist</a>
        <a href="/amazon-agency-pricing.html">Agency Pricing Guide</a>
        <a href="/case-studies.html">Case Studies</a>
        <a href="/write-for-us.html">Write for Us</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="/about.html">About SellTru</a>
        <a href="/about.html#contact-form">Contact</a>
        <a href="/about.html#contact-form">Get a Free Audit</a>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <p>(954) 869-2034</p>
        <p>contact@selltru.com</p>
        <p>333 Las Olas Way<br>Fort Lauderdale, FL 33301</p>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-left">
        <p>&copy; 2026 SellTru. All rights reserved. | Amazon Marketing Agency | Fort Lauderdale, FL</p>
      </div>
      <div class="footer-certs">
        <span class="footer-cert">Amazon SPN Certified</span>
        <span class="footer-cert">Amazon Ads Verified Partner</span>
      </div>
    </div>
  </div>
</footer>

<div class="sticky-audit-strip" id="sticky-strip" role="complementary" aria-label="Free audit offer">
  <div class="sticky-strip-text">
    <div class="sticky-strip-icon" aria-hidden="true">${ICON_SEARCH}</div>
    <div class="sticky-strip-copy">
      <div class="sticky-strip-headline">Free Amazon Audit</div>
      <div class="sticky-strip-sub">We'll find what's costing you. No obligation.</div>
    </div>
  </div>
  <div class="sticky-strip-actions">
    <a class="sticky-strip-cta" href="/about.html#contact-form">Get the Free Audit</a>
    <button class="sticky-strip-dismiss" id="strip-dismiss" aria-label="Dismiss">&times;</button>
  </div>
</div>`;

    // Sticky strip -- use this.querySelector since innerHTML was just set above
    const strip = this.querySelector('#sticky-strip');
    const dismiss = this.querySelector('#strip-dismiss');
    if (!strip || !dismiss) return;
    if (sessionStorage.getItem('strip-dismissed-' + location.pathname)) return;
    let shown = false;
    window.addEventListener('scroll', () => {
      if (!shown && window.scrollY > 300) {
        strip.classList.add('visible');
        shown = true;
      }
    }, { passive: true });
    dismiss.addEventListener('click', () => {
      strip.classList.remove('visible');
      sessionStorage.setItem('strip-dismissed-' + location.pathname, '1');
    });
  }
}

/* --- Register both elements ------------------------------------- */

customElements.define('selltru-header', SellTruHeader);
customElements.define('selltru-footer', SellTruFooter);
