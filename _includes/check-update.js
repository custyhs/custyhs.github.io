(function () {
  "use strict";

  var metadata = document.querySelector('meta[name="site-build-version"]');
  if (!metadata || !window.fetch || !window.URL) return;

  var currentVersion = Number(metadata.content);
  var updateParameter = "__site_version";
  var pageUrl = new window.URL(window.location.href);
  var attemptedVersion = Number((pageUrl.searchParams.get(updateParameter) || "").split("-")[0]) || 0;
  var requestId = 0;
  var navigating = false;

  /* Keep bookmarks, query parameters and anchors clean after an update. */
  if (pageUrl.searchParams.has(updateParameter)) {
    pageUrl.searchParams.delete(updateParameter);
    try {
      window.history.replaceState(window.history.state, "", pageUrl.href);
    } catch (error) { /* A restricted history API must not prevent reading. */ }
  }

  function nonce() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function checkForUpdate() {
    var thisRequest = ++requestId;
    var versionUrl = new window.URL(metadata.getAttribute("data-version-url"), window.location.href);
    versionUrl.searchParams.set("check", nonce());

    window.fetch(versionUrl.href, {
      cache: "no-store",
      mode: "same-origin",
      credentials: "omit"
    }).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (manifest) {
      if (thisRequest !== requestId || navigating || !manifest ||
          typeof manifest.version !== "string" || !/^\d{10,14}$/.test(manifest.version)) return;

      var latestVersion = Number(manifest.version);
      /* An older CDN response must not downgrade a page or cause a reload loop. */
      if (latestVersion <= currentVersion || latestVersion <= attemptedVersion) return;

      var freshUrl = new window.URL(window.location.href);
      freshUrl.searchParams.set(updateParameter, manifest.version + "-" + nonce());
      navigating = true;
      window.location.replace(freshUrl.href);
    }).catch(function () {
      /* Leave the current page usable when offline or during a failed deployment. */
    });
  }

  checkForUpdate();
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      attemptedVersion = 0;
      navigating = false;
      checkForUpdate();
    }
  });
})();
