(function () {
  try {
    var theme = localStorage.getItem("academic-theme");
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (error) { /* Reading remains available when storage is restricted. */ }
})();
