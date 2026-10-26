/* SellTru lead attribution for Formspree form xlgakqbq.
   Captures the page URL, document.referrer, and landing UTMs.
   Partial popup submits are labeled lead_stage=partial. */
(function () {
  if (window.__selltruLeadTracking) return;
  window.__selltruLeadTracking = true;

  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function readStore() {
    try {
      return JSON.parse(sessionStorage.getItem("selltru_utm") || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function writeStore(obj) {
    try { sessionStorage.setItem("selltru_utm", JSON.stringify(obj)); } catch (e) {}
  }

  try {
    var params = new URLSearchParams(window.location.search);
    var stored = readStore();
    var changedUtm = false;
    UTM_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) { stored[k] = v; changedUtm = true; }
    });
    if (changedUtm) writeStore(stored);
  } catch (e) {}

  function pageSlug() {
    var path = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
    if (path === "/" || path === "/index.html") return "home";
    var parts = path.split("/").filter(Boolean);
    return (parts[parts.length - 1] || "home").replace(/\.html$/, "");
  }

  function calendlyUrl() {
    return "https://calendly.com/andrewd3/30min?hide_gdpr_banner=1&utm_source=selltru.com&utm_medium=cta&utm_content=" + encodeURIComponent(pageSlug());
  }
  window.selltruCalendlyUrl = calendlyUrl;

  function honeypotValue() {
    var honeys = document.querySelectorAll('input[name="_gotcha"]');
    for (var i = 0; i < honeys.length; i++) {
      if (honeys[i].value) return honeys[i].value;
    }
    return "";
  }

  function leadFields(stage) {
    var utm = readStore();
    var fields = {
      page_url: window.location.href,
      referrer: document.referrer || "",
      lead_stage: stage || "complete",
      _gotcha: honeypotValue()
    };
    UTM_KEYS.forEach(function (k) {
      if (utm[k]) fields[k] = utm[k];
    });
    return fields;
  }
  window.selltruLeadFields = leadFields;

  function inferStage(data) {
    if (data.lead_stage === "partial" || data.lead_stage === "complete") return data.lead_stage;
    if (data.submission_type === "partial") return "partial";
    return "complete";
  }

  if (typeof window.fetch === "function" && !window.fetch.__selltruPatched) {
    var origFetch = window.fetch;
    var patched = function (input, init) {
      try {
        var url = "";
        if (typeof input === "string") url = input;
        else if (input && input.url) url = input.url;
        if (url.indexOf("formspree.io/f/xlgakqbq") !== -1 && init && typeof init.body === "string") {
          var data = JSON.parse(init.body);
          if (data && typeof data === "object" && !Array.isArray(data)) {
            var stage = inferStage(data);
            var extra = leadFields(stage);
            Object.keys(extra).forEach(function (k) {
              if (data[k] == null || data[k] === "") data[k] = extra[k];
            });
            data.lead_stage = stage;
            if (extra._gotcha) data._gotcha = extra._gotcha;
            init = Object.assign({}, init, { body: JSON.stringify(data) });
          }
        }
      } catch (e) {}
      return origFetch.call(this, input, init);
    };
    patched.__selltruPatched = true;
    window.fetch = patched;
  }

  function injectFields(form) {
    if (!form || form.getAttribute("data-selltru-tracking") === "1") return;
    if (form.hasAttribute("data-netlify") && form.hasAttribute("hidden")) return;
    form.setAttribute("data-selltru-tracking", "1");
    var stage = form.getAttribute("data-lead-stage") || "complete";
    var wrap = document.createElement("div");
    wrap.setAttribute("data-selltru-fields", "1");
    wrap.hidden = true;
    function add(type, name, value) {
      var input = document.createElement("input");
      input.type = type;
      input.name = name;
      if (value != null) input.value = value;
      if (name === "_gotcha") {
        input.tabIndex = -1;
        input.autocomplete = "off";
        input.setAttribute("aria-hidden", "true");
        input.style.display = "none";
      }
      wrap.appendChild(input);
    }
    add("text", "_gotcha", "");
    add("hidden", "page_url", window.location.href);
    add("hidden", "referrer", document.referrer || "");
    add("hidden", "lead_stage", stage);
    var utm = readStore();
    UTM_KEYS.forEach(function (k) {
      add("hidden", k, utm[k] || "");
    });
    form.appendChild(wrap);
  }

  function boot() {
    document.querySelectorAll("form").forEach(injectFields);
    document.querySelectorAll('a[href*="calendly.com/andrewd3/30min"]').forEach(function (a) {
      if (a.href.indexOf("utm_medium=cta") === -1) a.href = calendlyUrl();
    });
    document.querySelectorAll(".calendly-inline-widget").forEach(function (el) {
      el.setAttribute("data-url", calendlyUrl());
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("DOMContentLoaded", boot);
})();
document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".nav");e&&window.addEventListener("scroll",()=>{e.classList.toggle("scrolled",window.scrollY>20)},{passive:!0});const t=document.querySelector(".nav-hamburger"),n=document.querySelector(".nav-mobile");t&&n&&(t.addEventListener("click",()=>{const e=n.classList.toggle("open");t.setAttribute("aria-expanded",e)}),n.querySelectorAll("a").forEach(e=>{e.addEventListener("click",()=>{n.classList.remove("open"),t.setAttribute("aria-expanded","false")})}));const o=window.location.pathname.replace(/\/$/,"")||"/";document.querySelectorAll(".nav-link").forEach(e=>{((e.getAttribute("href")||"").replace(/\/$/,"")||"/")===o&&e.classList.add("active")}),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",t=>{const n=document.querySelector(e.getAttribute("href"));if(n){t.preventDefault();const e=80,o=n.getBoundingClientRect().top+window.scrollY-e;window.scrollTo({top:o,behavior:"smooth"})}})});const s=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("revealed"),s.unobserve(e.target))})},{threshold:0,rootMargin:"0px 0px 120px 0px"});{const h=[...document.querySelectorAll(".reveal")],v=h.map(e=>{const t=e.getBoundingClientRect();return t.top<window.innerHeight&&t.bottom>0});h.forEach((e,i)=>{if(v[i]){e.style.transition="none";e.classList.add("revealed");requestAnimationFrame(()=>requestAnimationFrame(()=>{e.style.transition=""}))}else{s.observe(e)}})};function submitToFormspree(formEl,onSuccess,onError){var endpoint="https://formspree.io/f/xlgakqbq";var data={};new FormData(formEl).forEach(function(value,key){if((key.charAt(0)==="_"&&key!=="_gotcha")||key==="source")return;if(value)data[key]=value;});fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)}).then(function(res){if(res.ok){onSuccess();}else{onError();}}).catch(function(){onError();});}const r=document.querySelector(".contact-form:not(#modal-audit-form)");r&&r.addEventListener("submit",e=>{e.preventDefault();const t=r.querySelector(".form-btn"),n=t.textContent;t.textContent="Sending…",t.disabled=!0,submitToFormspree(r,function(){window.gtag&&gtag("event","generate_lead",{"event_category":"conversion","event_label":"audit_request_form"});window.oaiq && oaiq('measure','registration_completed',{type:'customer_action'});t.textContent="Sending…";setTimeout(function(){window.location.href="/audit-thanks";},800);},function(){t.textContent="Error — Try Again";t.style.background="#EF4444";t.disabled=false;setTimeout(function(){t.textContent=n;t.style.background="";t.disabled=false;},4000);})});const p=document.querySelector(".lm-audit-form");p&&p.addEventListener("submit",function(e){e.preventDefault();var btn=p.querySelector(".form-btn"),orig=btn.textContent;btn.textContent="Sending…";btn.disabled=true;submitToFormspree(p,function(){window.gtag&&gtag("event","generate_lead",{"event_category":"conversion","event_label":"lead_magnet_form"});window.oaiq && oaiq('measure','registration_completed',{type:'customer_action'});btn.textContent="Sent!";btn.style.background="#10B981";p.reset();setTimeout(function(){btn.textContent=orig;btn.style.background="";btn.disabled=false;},3000);},function(){btn.textContent="Error — Try Again";btn.style.background="#EF4444";btn.disabled=false;setTimeout(function(){btn.textContent=orig;btn.style.background="";},4000);});});const a=new IntersectionObserver(e=>{e.forEach(e=>{if(!e.isIntersecting)return;const t=e.target,n=parseFloat(t.dataset.target),o=t.dataset.prefix||"",s=t.dataset.suffix||"",r=performance.now();requestAnimationFrame(function e(a){const c=a-r,i=Math.min(c/1800,1),l=1-Math.pow(1-i,3),d=n*l;t.textContent=o+(Number.isInteger(n)?Math.round(d):d.toFixed(1))+s,i<1&&requestAnimationFrame(e)}),a.unobserve(t)})},{threshold:.5});document.querySelectorAll("[data-target]").forEach(e=>a.observe(e));function c(e,t,n){fetch("https://formspree.io/f/xlgakqbq",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({email:e,source:t})}).then(function(){n();}).catch(function(){n();});}const i=document.getElementById("email-bar"),l=document.getElementById("email-bar-dismiss"),d=document.getElementById("email-bar-form");if(i&&!sessionStorage.getItem("email-bar-dismissed")&&!document.getElementById("blog-sticky-bar")){i.hidden=!1;const e=()=>i.classList.add("visible");let t=!1;const n=()=>{t||(t=!0,e())};setTimeout(n,1e4),window.addEventListener("scroll",()=>{window.scrollY>500&&n()},{passive:!0})}l&&l.addEventListener("click",()=>{i.classList.remove("visible"),sessionStorage.setItem("email-bar-dismissed","1")}),d&&d.addEventListener("submit",e=>{e.preventDefault();const t=d.querySelector('input[type="email"]').value,n=d.querySelector(".email-bar-btn");n.textContent="Sending...",n.disabled=!0,c(t,"sticky-bar",()=>{window.gtag&&gtag("event","sign_up",{"event_category":"engagement","event_label":"email_sticky_bar"}),n.textContent="Done!",n.style.background="#10B981",setTimeout(()=>{i.classList.remove("visible"),sessionStorage.setItem("email-bar-dismissed","1")},2e3)})});const u=document.getElementById("ec-form"),m=document.getElementById("ec-success");u&&u.addEventListener("submit",e=>{e.preventDefault();const t=u.querySelector('input[type="email"]').value,n=u.querySelector(".ec-submit");n.textContent="Sending...",n.disabled=!0,c(t,"inline-section",()=>{window.gtag&&gtag("event","sign_up",{"event_category":"engagement","event_label":"email_inline"});u.hidden=!0,m.hidden=!1})}),document.querySelectorAll(".faq-q").forEach(e=>{e.addEventListener("click",()=>{const t=e.closest(".faq-item"),n=t.classList.contains("open");document.querySelectorAll(".faq-item.open").forEach(e=>{e.classList.remove("open")}),n||t.classList.add("open")})});const mf=document.getElementById("modal-audit-form");if(mf&&!mf.dataset.hubspotBound){mf.dataset.hubspotBound="1";const ms=document.getElementById("modal-success"),mb=document.getElementById("modal-submit-btn");mf.addEventListener("submit",function(e){e.preventDefault();if(!mf.checkValidity()){mf.reportValidity();return;}if(mb){mb.disabled=true;mb.textContent="Sending…";}submitToFormspree(mf,function(){window.gtag&&gtag("event","generate_lead",{"event_category":"conversion","event_label":"modal_audit_form"});window.oaiq && oaiq('measure','registration_completed',{type:'customer_action'});if(ms&&mb){mf.hidden=true;ms.hidden=false;}},function(){if(mb){mb.disabled=false;mb.textContent="Send My Audit Request →";}alert("Something went wrong. Please email us at contact@selltru.com.");});});}const b=document.querySelectorAll(".filter-btn"),g=document.querySelectorAll(".blog-card");b.length&&g.length&&b.forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.filter;b.forEach(e=>e.classList.remove("active")),e.classList.add("active"),g.forEach(e=>{const n="all"===t||e.dataset.category===t;e.style.display=n?"":"none"})})})
  // GA4: track audit CTA button clicks
  document.addEventListener("click",function(e){
    var a=e.target.closest("a");
    if(a&&(a.href||"").indexOf("contact-form")!==-1){
      window.gtag&&gtag("event","cta_click",{"event_category":"engagement","event_label":"audit_cta"});
    }
  });
const wfuBtn=document.getElementById("wfu-submit-btn");if(wfuBtn){const wfuBoxes=document.querySelectorAll("#wfu-form input[type='checkbox']");function wfuCheck(){wfuBtn.disabled=[...wfuBoxes].some(cb=>!cb.checked);}wfuBoxes.forEach(cb=>cb.addEventListener("change",wfuCheck));}
});