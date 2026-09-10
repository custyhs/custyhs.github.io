(function () {
  "use strict";
  var root = document.documentElement;

  function each(list, callback) {
    for (var i = 0; i < list.length; i++) callback(list[i], i);
  }

  /* Theme toggle */
  var button = document.querySelector(".theme-toggle");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var dark = theme === "dark";
    var label = dark ? "Switch to light theme" : "Switch to dark theme";
    if (button) {
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(dark));
    }
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = dark ? "#141619" : "#ffffff";
  }
  if (button) {
    applyTheme(root.getAttribute("data-theme") || "light");
    button.hidden = false;
    button.addEventListener("click", function () {
      var theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(theme);
      try { localStorage.setItem("academic-theme", theme); } catch (error) { /* Optional preference storage. */ }
    });
    window.addEventListener("storage", function (event) {
      if (event.key === "academic-theme") applyTheme(event.newValue === "dark" ? "dark" : "light");
    });
  }

  /* Back to top */
  var topButton = document.querySelector(".back-to-top");
  if (topButton) {
    topButton.hidden = false;
    var updateTop = function () {
      topButton.classList.toggle("is-visible", window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", updateTop, { passive: true });
    updateTop();
    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* BibTeX toggle and copy */
  each(document.querySelectorAll(".pill-bibtex[aria-controls]"), function (toggle) {
    toggle.addEventListener("click", function () {
      var panel = document.getElementById(toggle.getAttribute("aria-controls"));
      if (!panel) return;
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
  });
  each(document.querySelectorAll(".copy-bibtex[data-target]"), function (copy) {
    copy.addEventListener("click", function () {
      var panel = document.getElementById(copy.getAttribute("data-target"));
      var pre = panel && panel.querySelector("pre");
      if (!pre) return;
      var text = pre.textContent;
      var done = function () {
        var label = copy.textContent;
        copy.textContent = "Copied";
        setTimeout(function () { copy.textContent = label; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });
  function fallbackCopy(text, done) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); done(); } catch (error) { /* Clipboard unavailable. */ }
    document.body.removeChild(area);
  }

  /* News: show a limited number of items until expanded. */
  var newsToggle = document.querySelector(".news-toggle");
  if (newsToggle) {
    var limit = Number(newsToggle.getAttribute("data-limit")) || 6;
    var items = document.querySelectorAll(".news-list li[data-index]");
    var hiddenCount = 0;
    each(items, function (item) { if (Number(item.getAttribute("data-index")) > limit) hiddenCount++; });
    if (hiddenCount > 0) {
      var expanded = false;
      var render = function () {
        each(items, function (item) { item.hidden = !expanded && Number(item.getAttribute("data-index")) > limit; });
        newsToggle.textContent = expanded ? "Show fewer" : "Show all news (" + items.length + ")";
        newsToggle.setAttribute("aria-expanded", String(expanded));
      };
      newsToggle.hidden = false;
      render();
      newsToggle.addEventListener("click", function () { expanded = !expanded; render(); });
    }
  }
})();
