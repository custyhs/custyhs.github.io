https://custyhs.github.io/

This Website is based on https://academicpages.github.io/.

## Academic design

The main pages use a custom Jekyll layout inspired by the reading-focused style
of https://yandaichn.github.io/: a centered column, serif body text, purple links,
and a portrait beside the introduction. All fonts and icons are served locally.

- Edit the homepage in `_pages/about.md` and awards in `_pages/awards.md`.
- Maintain papers in `_data/publications.yml`; `featured: true` also shows a paper
  under Recent work. Author order and `*` contribution marks are preserved.
- Adjust the layout in `_layouts/academic.html` and styles in `_sass/_academic.scss`.
- The theme button remembers a light/dark preference on the current browser.
- Run `bundle exec jekyll serve --host 127.0.0.1 --port 8767` for a local preview.

The AcademicPages layouts remain available for other page types. The main pages
use the existing build-version update check described below.

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
