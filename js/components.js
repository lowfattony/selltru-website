/**
 * SellTru Web Components -- components.js
 *
 * Defines <selltru-header> and <selltru-footer> custom elements.
 * Loaded synchronously (no defer) in <head> so both elements are
 * registered before the browser parses them in <body>, meaning
 * connectedCallback fires during parsing -- before main.js runs.
 */

// ── Microsoft Clarity heatmap + session recording ────────────────
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "wmzqznte2l");


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
    initAuditModal();
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
        <a href="/walmart-advertising-cost.html">Walmart Advertising Cost</a>
        <a href="/walmart-connect-calculator.html">Walmart Connect Calculator</a>
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


/* --- Audit Modal (shared across all pages) ------------------------------ */

function initAuditModal() {
  if (document.getElementById('audit-modal')) return; // already initialised

  // ── CSS ──
  var style = document.createElement('style');
  style.textContent = [
    '.modal-overlay{position:fixed;inset:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(13,27,42,.72);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;transition:opacity .26s ease;pointer-events:none;}',
    '.modal-overlay.modal-active{opacity:1;pointer-events:all;}',
    '.modal-box{background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;padding:40px 40px 36px;position:relative;transform:translateY(20px) scale(.98);transition:transform .26s cubic-bezier(.34,1.3,.64,1);}',
    '.modal-overlay.modal-active .modal-box{transform:none;}',
    '.modal-close{position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;font-size:22px;line-height:1;color:#94A3B8;padding:6px 8px;border-radius:8px;transition:color .15s,background .15s;}',
    '.modal-close:hover{color:#0D1B2A;background:rgba(0,0,0,.06);}',
    '.modal-box h2{font-family:"Plus Jakarta Sans",-apple-system,sans-serif;font-size:22px;font-weight:800;color:#0D1B2A;margin-bottom:6px;}',
    '.modal-box .modal-sub{font-size:14px;color:#64748B;margin-bottom:24px;}',
    '.modal-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}',
    '.modal-field{margin-bottom:12px;}',
    '.modal-field label{display:block;font-size:12px;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:.04em;margin-bottom:5px;}',
    '.modal-field input,.modal-field select,.modal-field textarea{width:100%;padding:10px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;color:#1E293B;font-family:"Inter",-apple-system,sans-serif;background:#fff;transition:border-color .15s;}',
    '.modal-field input:focus,.modal-field select:focus,.modal-field textarea:focus{outline:none;border-color:#1A56DB;}',
    '.modal-field textarea{resize:vertical;min-height:72px;}',
    '.modal-submit{width:100%;margin-top:8px;padding:14px;background:#FF6B35;color:#fff;font-family:"Plus Jakarta Sans",-apple-system,sans-serif;font-size:16px;font-weight:700;border:none;border-radius:12px;cursor:pointer;transition:background .2s;}',
    '.modal-submit:hover{background:#E55A28;}',
    '.modal-success{display:none;text-align:center;padding:20px 0;}',
    '.modal-success .success-icon{font-size:40px;margin-bottom:12px;}',
    '.modal-success h3{font-family:"Plus Jakarta Sans",-apple-system,sans-serif;font-size:20px;font-weight:800;color:#0D1B2A;margin-bottom:8px;}',
    '.modal-success p{color:#64748B;font-size:14px;line-height:1.6;}',
    '@media(max-width:520px){.modal-box{padding:28px 20px 24px;}.modal-row{grid-template-columns:1fr;}}'
  ].join('');
  document.head.appendChild(style);

  // ── HTML ──
  var overlay = document.createElement('div');
  overlay.id = 'audit-modal';
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');
  overlay.hidden = true;
  overlay.innerHTML = [
    '<div class="modal-box">',
    '  <button class="modal-close" id="modal-close-btn" aria-label="Close">&times;</button>',
    '  <h2 id="modal-title">Get Your Free Amazon Audit</h2>',
    '  <p class="modal-sub">We\'ll review your account and show you exactly where the waste is. Takes 2 minutes to request.</p>',
    '  <div class="modal-success" id="modal-success">',
    '    <div class="success-icon">&#10003;</div>',
    '    <h3>Request received.</h3>',
    '    <p>We\'ll review your account and be in touch within 1 business day.</p>',
    '  </div>',
    '  <form id="modal-audit-form" action="https://formspree.io/f/xlgakqbq" method="POST">',
    '    <div class="modal-row">',
    '      <div class="modal-field"><label for="m-fname">First Name</label><input type="text" id="m-fname" name="first_name" placeholder="Jane" required></div>',
    '      <div class="modal-field"><label for="m-lname">Last Name</label><input type="text" id="m-lname" name="last_name" placeholder="Smith" required></div>',
    '    </div>',
    '    <div class="modal-field"><label for="m-email">Work Email</label><input type="email" id="m-email" name="email" placeholder="jane@brand.com" required></div>',
    '    <div class="modal-field"><label for="m-brand">Brand / Company Name</label><input type="text" id="m-brand" name="brand_name" placeholder="Your brand name" required></div>',
    '    <div class="modal-row">',
    '      <div class="modal-field"><label for="m-revenue">Annual Amazon Revenue</label><select id="m-revenue" name="annual_revenue"><option value="">Select range</option><option>Under $500K</option><option>$500K - $1M</option><option>$1M - $3M</option><option>$3M - $5M</option><option>$5M+</option></select></div>',
    '      <div class="modal-field"><label for="m-adspend">Monthly Ad Spend</label><select id="m-adspend" name="monthly_ad_spend"><option value="">Select range</option><option>Under $5K</option><option>$5K - $15K</option><option>$15K - $30K</option><option>$30K - $50K</option><option>$50K+</option></select></div>',
    '    </div>',
    '    <div class="modal-field"><label for="m-acos">Current ACoS (if known)</label><input type="text" id="m-acos" name="current_acos" placeholder="e.g. 35%"></div>',
    '    <div class="modal-field"><label for="m-goal">Biggest Challenge Right Now</label><textarea id="m-goal" name="biggest_challenge" placeholder="e.g. ACOS keeps climbing, not sure why..."></textarea></div>',
    '    <button type="submit" class="modal-submit">Request My Free Audit &rarr;</button>',
    '  </form>',
    '</div>'
  ].join('');
  document.body.appendChild(overlay);

  // ── JS ──
  function openModal(e) {
    if (e) e.preventDefault();
    var form = document.getElementById('modal-audit-form');
    var success = document.getElementById('modal-success');
    if (form) form.style.display = '';
    if (success) success.style.display = 'none';
    overlay.hidden = false;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        overlay.classList.add('modal-active');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('modal-active');
    document.body.style.overflow = '';
    setTimeout(function() { overlay.hidden = true; }, 260);
  }

  // expose globally so bar-cta onclick can call it
  window.openAuditModal = openModal;

  // close button
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);

  // backdrop click
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });

  // event delegation — catches triggers added to DOM after init (e.g. sticky bar)
  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('[data-modal-trigger="audit"]');
    if (trigger) openModal(e);
  });

  // form submit
  var form = document.getElementById('modal-audit-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('.modal-submit');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function(r) {
        if (r.ok) {
          form.style.display = 'none';
          var s = document.getElementById('modal-success');
          if (s) s.style.display = 'block';
        } else {
          if (btn) { btn.disabled = false; btn.textContent = 'Request My Free Audit →'; }
          alert('Something went wrong. Please email us at contact@selltru.com');
        }
      }).catch(function() {
        if (btn) { btn.disabled = false; btn.textContent = 'Request My Free Audit →'; }
        alert('Something went wrong. Please email us at contact@selltru.com');
      });
    });
  }
}

/* --- Register both elements ------------------------------------- */

customElements.define('selltru-header', SellTruHeader);
customElements.define('selltru-footer', SellTruFooter);
