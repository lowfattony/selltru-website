/* ============================================================
   SELLTRU — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* === NAVIGATION: scrolled class === */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* === MOBILE MENU === */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* === ACTIVE NAV LINK === */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === currentPath) link.classList.add('active');
  });

  /* === SMOOTH SCROLL for anchor links === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* === SCROLL REVEAL === */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* === CONTACT FORM === */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(res => {
        if (res.ok) {
          btn.textContent = 'Message Sent!';
          btn.style.background = '#10B981';
          form.reset();
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        } else {
          btn.textContent = 'Error — Try Again';
          btn.style.background = '#EF4444';
          btn.disabled = false;
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
          }, 4000);
        }
      })
      .catch(() => {
        btn.textContent = 'Error — Try Again';
        btn.style.background = '#EF4444';
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 4000);
      });
    });
  }

  /* === STAT COUNTER ANIMATION === */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => countObserver.observe(el));

  /* === EMAIL CAPTURE — Formspree === */
  const FORMSPREE_URL = 'https://formspree.io/f/xlgakqbq';

  function submitEmailToNetlify(email, source, onSuccess) {
    const data = new FormData();
    data.append('email', email);
    data.append('source', source);
    data.append('_subject', 'New Email Capture — SellTru (' + source + ')');

    fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    })
    .then(() => onSuccess())
    .catch(() => onSuccess()); // show success regardless to avoid frustrating users
  }

  /* === STICKY EMAIL BAR === */
  const emailBar = document.getElementById('email-bar');
  const emailBarDismiss = document.getElementById('email-bar-dismiss');
  const emailBarForm = document.getElementById('email-bar-form');

  if (emailBar && !sessionStorage.getItem('email-bar-dismissed')) {
    emailBar.hidden = false;
    const showBar = () => emailBar.classList.add('visible');
    // Show after scrolling past hero or after 10 seconds, whichever comes first
    let shown = false;
    const maybeShow = () => { if (!shown) { shown = true; showBar(); } };
    setTimeout(maybeShow, 10000);
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) maybeShow();
    }, { passive: true });
  }

  if (emailBarDismiss) {
    emailBarDismiss.addEventListener('click', () => {
      emailBar.classList.remove('visible');
      sessionStorage.setItem('email-bar-dismissed', '1');
    });
  }

  if (emailBarForm) {
    emailBarForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = emailBarForm.querySelector('input[type="email"]').value;
      const btn = emailBarForm.querySelector('.email-bar-btn');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      submitEmailToNetlify(email, 'sticky-bar', () => {
        btn.textContent = 'Done!';
        btn.style.background = '#10B981';
        setTimeout(() => {
          emailBar.classList.remove('visible');
          sessionStorage.setItem('email-bar-dismissed', '1');
        }, 2000);
      });
    });
  }

  /* === INLINE EMAIL CAPTURE FORM === */
  const ecForm = document.getElementById('ec-form');
  const ecSuccess = document.getElementById('ec-success');

  if (ecForm) {
    ecForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = ecForm.querySelector('input[type="email"]').value;
      const btn = ecForm.querySelector('.ec-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      submitEmailToNetlify(email, 'inline-section', () => {
        ecForm.hidden = true;
        ecSuccess.hidden = false;
      });
    });
  }

  /* === FAQ ACCORDION === */
  document.querySelectorAll('.faq-q').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all open items
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // If the clicked item wasn't already open, open it
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

});
