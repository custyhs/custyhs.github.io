# Homepage Redesign v2 — Design Spec

Date: 2026-09-09. Branch: `design/academic-homepage`. Baseline commit: `5519eec`.

## Goal

Turn the first rewrite pass (baseline) into the approved design: a reading-focused
academic homepage in the "ink-blue journal" direction, with reference-style
publication entries, the agreed content modules, and a lean codebase that keeps
the GitHub Pages default build and the build-version update check.

Reference for structure only: https://yandaichn.github.io/ (al-folio + custom CSS).
The result must be recognisably different in colour, photo treatment, and details.

## Scope

In scope: layout, styles, scripts, page templates, data files, avatar asset,
tests, cleanup of unused AcademicPages templates, README update.

Out of scope: bilingual UI, blog, teaching page, analytics, scroll progress bar,
migrating to al-folio, changing publication content beyond links/BibTeX/topics.

## Visual system: ink-blue journal

Fonts are system fonts only (no web fonts):

- Body: Georgia, "Times New Roman", "Songti SC", serif; 17px / 1.65 desktop, 16px / 1.7 mobile.
- Headings, navigation, labels, pills: -apple-system, "Segoe UI", "PingFang SC", sans-serif.

Tokens (CSS custom properties; `data-theme="dark"` overrides):

| Token | Light | Dark |
| --- | --- | --- |
| `--paper` (background) | `#ffffff` | `#141619` |
| `--ink` (text) | `#1f2328` | `#e6e8eb` |
| `--muted` (dates, meta) | `#6b7280` | `#a3a9b3` |
| `--accent` (links, venue, self-author) | `#1f4e8c` | `#7fb0ff` |
| `--accent-hover` | `#2a6fc9` | `#a9c8ff` |
| `--accent-soft` (chip/pill fill) | `rgba(31,78,140,.08)` | `rgba(127,176,255,.14)` |
| `--note` (honours) | `#b42318` | `#ff8a80` |
| `--line` (hairlines) | `#e5e7eb` | `#2b3036` |
| `--hover` (button hover fill) | `#f3f5f8` | `#1d2126` |

Components:

- Header: sticky, 64px, brand left, nav right, theme toggle. Current page shows a
  2px accent underline bar; hover draws the underline from the left. Mobile: brand
  and toggle on row one, links on row two, no hamburger.
- Section headings (h2 on content pages and home sections): sans, uppercase,
  letter-spacing .08em, 14–15px, accent colour, hairline below. Page h1 stays large.
- Links: accent, no underline; hover underline animates from the left. Reduced
  motion disables animations.
- Portrait: circular, 200px desktop / 150px mobile, 2px accent ring with 4px gap,
  served from `images/avatar-600.jpg` (pre-cropped, ~40 KB). Original photos kept.
- Footer: hairline, © line left, "Built with Jekyll · Updated <Month YYYY>" right,
  and a back-to-top button that appears after one viewport of scrolling.

## Pages

### Home (`/`)

1. Name block: h1 "Yu Chen" with `陈禹` in muted weight; subtitle line.
2. Intro: two columns on desktop (text left, portrait right); original wording from
   `master` restored verbatim (three paragraphs). Contact row: Email, Google Scholar,
   GitHub, CV (icon + label).
3. Research topic tags: chips linking to `/publications/?topic=<slug>`.
4. Selected papers: three cards (venue badge, title, one-line note), one per research
   direction. Chosen via `featured: true` + `featured_note` in publications data.
   Placeholder picks until the user specifies: uniINF (ICLR 2025 Spotlight),
   Provable Risk-Sensitive Distributional RL (ICML 2024), Reward-free Linear MDPs (ICLR 2023).
5. Recent News: date column + text, from `_data/news.yml`; 6 shown, rest behind a
   "Show all" toggle (all shown without JS).
6. Research Interests: original three bullets with original titles and
   representative-work links, restored verbatim.
7. Academic Services: original two lines; label column widened to avoid wrapping.

### Publications (`/publications/`)

- Intro line + Google Scholar link + equal-contribution note.
- Toolbar: topic chips (All + six topics) and year jump links (2026 … 2022).
  Filtering is client-side; entries carry `data-topics` and `data-year`.
- Two sections, "Preprints" and "Publications", each reverse chronological.
- Entry layout (grid, 5rem + 1fr):
  - Left `pub-meta`: venue abbreviation (accent, bold, sans) over year (muted).
    Preprints show "arXiv".
  - Right `pub-body`: title (ink, 17–18px, not a link); authors (self in accent,
    bold; `*` preserved); optional note line (`--note` colour, e.g. Spotlight, Top 5%);
    pill row: Paper, arXiv, Code, BibTeX. BibTeX toggles a `<details>` block with a
    `<pre>` and a Copy button.
- Hairline between entries; mobile collapses to one column with meta inline.

### Awards (`/awards/`)

- Chronological list; each row: year badge (pill), type icon (trophy = research
  honour, graduation cap = scholarship, flag = competition), bold title, description.
- Original text restored, including the red-highlighted notes now rendered in `--note`.
- "2020–21" row split into separate 2021 and 2020 rows.

### 404

Unchanged content; uses the academic layout.

## Data model

`_data/publications.yml` (one item per paper, reverse chronological):

```yaml
- id: chen2025uniinf          # stable key, also used for anchors
  title: "…"
  authors: ["Yu Chen*", "Jiatai Huang*", "Yan Dai*", "Longbo Huang"]
  year: 2025
  kind: publication            # publication | preprint
  venue: ICLR                  # short label for the left column
  venue_full: "The Thirteenth International Conference on Learning Representations"
  note: "Spotlight, Top 5%"    # optional honour line
  topics: [heavy-tailed]       # slugs from the topic list below
  featured: true               # optional, home cards
  featured_note: "…"           # optional one-liner for the card
  links:                       # ordered pills
    - { label: Paper, url: "https://openreview.net/forum?id=…", kind: paper }
    - { label: arXiv, url: "https://arxiv.org/abs/2410.03284", kind: arxiv }
    - { label: Code,  url: "…", kind: code }
  bibtex: |                    # optional; enables the BibTeX pill
    @inproceedings{…}
```

Topic slugs and labels: `heavy-tailed` Heavy-tailed & robust bandits;
`risk-sensitive` Risk-sensitive RL; `function-approximation` RL with function
approximation; `generative` Generative model theory; `llm` LLMs & distribution
matching; `scheduling` Scheduling & networking. Initial assignments are the
implementer's reading of titles and need the author's check.

`_data/news.yml`: ordered list of `{ when: "Aug 2026", html: "…" }`. Seed entries
come only from verified facts (arXiv dates from the 2026-09-09 review note;
conference acceptances and scholarships at year precision).

`_data/navigation.yml`: unchanged labels (Publications, Awards, CV).

## Client-side behaviour (`assets/js/academic.js`, no dependencies)

- Theme toggle (existing) with localStorage persistence.
- Topic filter + year jump; reads `?topic=` on load; hides non-matching entries and
  empty sections; updates the URL without reload.
- News "Show all" toggle.
- BibTeX copy buttons (Clipboard API with fallback selection).
- Back-to-top button.
- All features degrade to fully visible content without JS.

## Preserved features

- `_includes/head.html`: `site-build-version` meta, inline `check-update.js`,
  versioned local asset URLs, `version.json`, sitemap exclusion.
- `tests/check-build.rb` (avatar selector updated to `img.site-avatar`) and
  `tests/check-update.test.cjs` continue to pass.
- GitHub Pages default build: `github-pages` gem, Jekyll 3.9, no new plugins.

## Cleanup (separate commit)

Remove unused AcademicPages layouts (`single`, `archive`, `archive-taxonomy`,
`splash`, `talk`), their includes, `_sass/*` except `vendor/` and the academic
stylesheet, `assets/css/main.scss`, `assets/js/main.min.js`, `_main.js`,
`plugins/`, `_data/authors.yml`, `_data/ui-text.yml`, `_drafts/`, and the
`uglify`/`watch:js`/`build:js` npm scripts. Keep `markdown_generator/`, `talkmap*`,
`LICENSE`, and the update-check test. Move `design-qa.md` under `docs/`.

## Verification

- `bundle exec jekyll build` with a local `url` override, then `tests/check-build.rb`
  and `npm test`.
- Screenshots at 1280px and 390px (device emulation) for home, publications, awards,
  light and dark.
- Manual checks: filter chips, year jump, news toggle, BibTeX copy, back-to-top,
  keyboard focus order.

## Open items

- The user will name the three featured papers; placeholders are used until then.
- Topic assignments and seeded news wording need the author's review.
- BibTeX entries are collected from official pages; any generated from metadata are
  marked in the data file.

## Change log

- 2026-09-09: the "Selected papers" card row was removed from the homepage at the author's request; the `featured` fields were dropped from the publication data.
