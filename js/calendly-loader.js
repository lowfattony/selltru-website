/* Loads Calendly widget.js and widget.css together, only after a booking click. */
(function () {
  if (window.selltruLoadCalendly) return;
  if (!document.getElementById("selltru-calendly-nav")) {
    var navStyle = document.createElement("style");
    navStyle.id = "selltru-calendly-nav";
    navStyle.textContent = "body:has(.calendly-overlay) .nav-hamburger{visibility:hidden}";
    document.head.appendChild(navStyle);
  }
  var CSS_URL = "https://assets.calendly.com/assets/external/widget.css";
  var JS_URL = "https://assets.calendly.com/assets/external/widget.js";

  function append(tagName, attrs, done) {
    var el = document.createElement(tagName);
    Object.keys(attrs).forEach(function (key) { el.setAttribute(key, attrs[key]); });
    var settled = false;
    function finish(err) {
      if (settled) return;
      settled = true;
      done(err || null);
    }
    el.addEventListener("load", function () { finish(null); });
    el.addEventListener("error", function () { finish(new Error("load")); });
    document.head.appendChild(el);
  }

  window.selltruLoadCalendly = function (done) {
    var finished = false;
    var timer = setTimeout(function () { complete(new Error("timeout")); }, 4000);
    function complete(err) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      done(err);
    }
    var cssReady = !!document.querySelector('link[data-selltru-calendly-css="1"]');
    var jsReady = !!(window.Calendly && window.Calendly.initPopupWidget);
    if (cssReady && jsReady) { complete(null); return; }
    var pending = 2;
    function one(err) {
      if (finished) return;
      if (err) { complete(err); return; }
      pending -= 1;
      if (pending > 0) return;
      var tries = 0;
      var poll = setInterval(function () {
        tries += 1;
        if (window.Calendly && window.Calendly.initPopupWidget) {
          clearInterval(poll);
          complete(null);
        } else if (tries > 20) {
          clearInterval(poll);
          complete(new Error("missing"));
        }
      }, 50);
    }
    if (cssReady) one(null);
    else append("link", { rel: "stylesheet", href: CSS_URL, "data-selltru-calendly-css": "1" }, one);
    if (jsReady) one(null);
    else {
      var existing = document.querySelector('script[data-selltru-calendly="1"]');
      if (existing) {
        existing.addEventListener("load", function () { one(null); });
        existing.addEventListener("error", function () { one(new Error("load")); });
      } else {
        append("script", { src: JS_URL, async: "true", "data-selltru-calendly": "1" }, one);
      }
    }
  };

  if (window.__selltruCalendlyClick) return;
  window.__selltruCalendlyClick = true;
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest('a[href*="calendly.com"]');
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var url = link.href;
    var popupReady = window.Calendly && window.Calendly.initPopupWidget && document.querySelector('link[data-selltru-calendly-css="1"]');
    if (!popupReady) {
      /* Hold navigation only while the widget files load. A new tab is the fallback. */
      e.preventDefault();
      var settled = false;
      function openTab() {
        if (settled) return;
        settled = true;
        window.open(url, "_blank", "noopener");
      }
      var slow = setTimeout(openTab, 4000);
      window.selltruLoadCalendly(function (err) {
        if (settled) return;
        clearTimeout(slow);
        if (!err && window.Calendly && window.Calendly.initPopupWidget) {
          settled = true;
          window.Calendly.initPopupWidget({ url: url });
        } else {
          openTab();
        }
      });
      return;
    }
    e.preventDefault();
    window.Calendly.initPopupWidget({ url: url });
  });
})();
