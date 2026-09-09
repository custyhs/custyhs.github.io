(function () {
  "use strict";
  var root = document.documentElement;
  var button = document.querySelector(".theme-toggle");
  if (!button) return;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var dark = theme === "dark";
    var label = dark ? "Switch to light theme" : "Switch to dark theme";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", String(dark));
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = dark ? "#19171c" : "#ffffff";
  }

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
})();
