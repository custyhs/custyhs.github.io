https://custyhs.github.io/

This Website is based on https://academicpages.github.io/.

## Site structure

The site uses one custom Jekyll layout and a small set of partials; the
AcademicPages templates it was forked from have been removed.

- `_layouts/academic.html` – page shell (header, content column, footer, back-to-top).
- `_includes/academic-*.html` – header, contact row, topic tags, news list,
  publication entry, publication toolbar, share-card metadata.
- `_sass/_academic.scss` – all styles (ink-blue tokens, light and dark themes).
- `assets/js/academic.js` – theme toggle, topic filter, year jump, BibTeX copy,
  news toggle, back-to-top. Everything degrades to fully visible content without JS.
- `_pages/about.md`, `_pages/publications.md`, `_pages/awards.md` – page content.

Content lives in data files:

- `_data/publications.yml` – one entry per paper: `id`, `title`, `authors`, `year`,
  `kind` (`publication` or `preprint`), `venue`, `venue_full`, optional `note`,
  `topics` (slugs from `_data/topics.yml`), `links` (pills: `paper`, `arxiv`, `code`,
  `slides`, `video`),
  optional `bibtex` (enables the BibTeX pill).
- BibTeX entries: PMLR, IEEE, and ACM papers carry the publisher's entry; the two
  preprints carry arXiv's entry; ICLR papers and ICML 2026 papers (no PMLR volume at
  the time of writing) carry an `@inproceedings` assembled from the site's own
  metadata, so replace those with the official entries when they become available.
- `_data/topics.yml` – topic slugs and labels; `home: true` topics appear as homepage tags.
- `_data/news.yml` – homepage news (`when`, Markdown `text`), newest first.
- `_data/navigation.yml` – header links.

Local preview (this machine needs the Homebrew Ruby, not the system one):

    export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"
    bundle exec jekyll serve --host 127.0.0.1 --port 4000

`jekyll build` keeps the production `url`, so a static preview of the build output
needs a config override such as `--config _config.yml,local.yml` with
`url: "http://127.0.0.1:4000"`; `jekyll serve` handles this automatically.

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
