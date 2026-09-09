(function () {
  "use strict";
  var root = document.documentElement;

  /* Pure helpers (also unit-tested in tests/academic.test.cjs). */
  var Academic = {
    parseTopic: function (search, known) {
      var match = /[?&]topic=([^&#]+)/.exec(search || "");
      var value = match ? decodeURIComponent(match[1]) : "all";
      return known.indexOf(value) === -1 ? "all" : value;
    },
    matchesTopic: function (topics, topic) {
      if (topic === "all") return true;
      return (" " + (topics || "") + " ").indexOf(" " + topic + " ") !== -1;
    },
    visibleIds: function (entries, topic) {
      var ids = [];
      for (var i = 0; i < entries.length; i++) {
        if (Academic.matchesTopic(entries[i].topics, topic)) ids.push(entries[i].id);
      }
      return ids;
    },
    topicUrl: function (pathname, search, topic) {
      var params = new URLSearchParams(search || "");
      params.delete("topic");
      if (topic !== "all") params.append("topic", topic);
      var query = params.toString();
      return pathname + (query ? "?" + query : "");
    }
  };
  window.Academic = Academic;

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

  /* Publication topic filter */
  var toolbar = document.querySelector(".pub-toolbar");
  if (toolbar) {
    var chips = toolbar.querySelectorAll("[data-topic]");
    var known = [];
    each(chips, function (chip) { known.push(chip.getAttribute("data-topic")); });
    var entries = document.querySelectorAll("li.pub");
    var sections = document.querySelectorAll(".publication-section");
    var emptyMessage = document.querySelector("[data-empty-message]");

    var applyFilter = function (topic, updateUrl) {
      each(chips, function (chip) {
        chip.setAttribute("aria-pressed", String(chip.getAttribute("data-topic") === topic));
      });
      var anyVisible = false;
      each(entries, function (entry) {
        entry.hidden = !Academic.matchesTopic(entry.getAttribute("data-topics"), topic);
        if (!entry.hidden) anyVisible = true;
      });
      each(sections, function (section) {
        var visible = false;
        each(section.querySelectorAll("li.pub"), function (entry) { if (!entry.hidden) visible = true; });
        section.hidden = !visible;
      });
      if (emptyMessage) emptyMessage.hidden = anyVisible;
      if (updateUrl && window.history && window.history.replaceState) {
        try {
          window.history.replaceState(window.history.state, "", Academic.topicUrl(window.location.pathname, window.location.search, topic) + window.location.hash);
        } catch (error) { /* A restricted history API must not break filtering. */ }
      }
    };

    applyFilter(Academic.parseTopic(window.location.search, known), false);
    each(chips, function (chip) {
      chip.addEventListener("click", function () { applyFilter(chip.getAttribute("data-topic"), true); });
    });

    /* Year jump: scroll to the first visible entry of that year. */
    each(document.querySelectorAll(".year-jump a"), function (link) {
      link.addEventListener("click", function (event) {
        var year = link.getAttribute("href").replace("#year-", "");
        var target = null;
        each(entries, function (entry) {
          if (!target && !entry.hidden && entry.getAttribute("data-year") === year) target = entry;
        });
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
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
