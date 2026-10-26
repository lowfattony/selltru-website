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
