https://custyhs.github.io/

This Website is based on https://academicpages.github.io/.

## Update checks

Every Jekyll build writes its UTC Unix timestamp to `version.json`, the page's
`site-build-version` metadata, and the URLs of local stylesheets, scripts, avatars
and icons. No manual version increment or additional Jekyll plugin is needed.

The inline `_includes/check-update.js` checks `version.json` on each page load and
when a page is restored from the browser's back/forward cache. Requests use
`cache: "no-store"` and a unique query parameter. A newer build triggers one
navigation to a fresh URL for the same page; existing query parameters and anchors
are preserved, and the internal update parameter is then removed. Older manifests,
failed requests and incomplete deployments do not cause repeated reloads.

This is a client-side update check, not a change to GitHub Pages' HTTP cache
headers. It requires JavaScript and a network connection and may briefly display
the cached page before an update arrives. Existing cached pages from before this
feature was deployed must first expire or be refreshed once to acquire it.

Run `npm test` for update-check regression tests (Node.js 18 or later; no npm
dependencies are needed). After `bundle exec jekyll build`, run
`bundle exec ruby tests/check-build.rb _site` to verify generated version metadata
and asset URLs.
