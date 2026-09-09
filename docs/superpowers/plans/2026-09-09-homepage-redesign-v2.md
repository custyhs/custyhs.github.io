# Homepage Redesign v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the baseline academic layout into the approved ink-blue design with reference-style publication entries, the agreed home/publications/awards modules, and a cleaned-up repository.

**Architecture:** Jekyll 3.9 site built by the GitHub Pages default pipeline. One layout (`_layouts/academic.html`), a handful of `_includes/academic-*.html` partials, one stylesheet (`_sass/_academic.scss` compiled through `assets/css/academic.scss`), one dependency-free script (`assets/js/academic.js`), and YAML data files that drive publications, topics, and news. Tests are a Ruby build check (nokogiri) and Node `node:test` unit tests run through `node:vm`.

**Tech Stack:** Jekyll 3.9 (github-pages gem 223), Liquid, SCSS (Jekyll's bundled Sass 3.7), vanilla JS, Ruby + nokogiri for build checks, Node 18+ `node:test`.

**Spec:** `docs/superpowers/specs/2026-09-09-homepage-redesign-v2-design.md`

## Global Constraints

- Build command (this machine): `export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"` then `bundle exec jekyll build -d /tmp/custyhs_site_v2 --config _config.yml,/tmp/local-url-4174.yml` (the override file contains `url: "http://127.0.0.1:4174"` so local previews load local CSS).
- After every build: `bundle exec ruby tests/check-build.rb /tmp/custyhs_site_v2` must pass and `npm test` must pass.
- No new Jekyll plugins. No web fonts. No jQuery. All scripts degrade gracefully without JS.
- Keep the `site-build-version` meta, the inline `check-update.js`, versioned local asset URLs (`?v={{ site_version }}`), `version.json`, and the sitemap exclusion untouched.
- Colours, fonts, and component rules follow the spec's token table exactly.
- Commit after each task with an English message ending in the Claude co-author line.
- Publication content (titles, authors, venues, years) must not change; only links, notes, topics, ids, and BibTeX are added.

---

### Task 1: Ink-blue tokens, typography, header, footer, back-to-top

**Files:**
- Modify: `_sass/_academic.scss` (replace the `:root` block, header rules, footer rules; add underline animation, reduced motion, back-to-top)
- Modify: `_layouts/academic.html` (footer markup, back-to-top button)
- Modify: `_includes/academic-header.html` (nav link markup unchanged; class hooks only)
- Modify: `assets/js/academic.js` (back-to-top wiring)

**Interfaces:**
- Produces: CSS custom properties `--paper --ink --muted --accent --accent-hover --accent-soft --note --line --hover --serif --sans`; classes `.site-header`, `.site-navigation a[aria-current="page"]`, `.site-footer`, `.back-to-top`, `.section-label` (uppercase sans label used by later tasks).

- [ ] **Step 1: Replace tokens**

```scss
:root {
  --paper: #ffffff; --ink: #1f2328; --muted: #6b7280;
  --accent: #1f4e8c; --accent-hover: #2a6fc9; --accent-soft: rgba(31, 78, 140, .08);
  --note: #b42318; --line: #e5e7eb; --hover: #f3f5f8;
  --serif: Georgia, "Times New Roman", "Songti SC", serif;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "PingFang SC", sans-serif;
  color-scheme: light;
}
:root[data-theme="dark"] {
  --paper: #141619; --ink: #e6e8eb; --muted: #a3a9b3;
  --accent: #7fb0ff; --accent-hover: #a9c8ff; --accent-soft: rgba(127, 176, 255, .14);
  --note: #ff8a80; --line: #2b3036; --hover: #1d2126;
  color-scheme: dark;
}
```

- [ ] **Step 2: Links with sliding underline, section labels, reduced motion**

```scss
a { color: var(--accent); text-decoration: none; background-image: linear-gradient(currentColor, currentColor); background-repeat: no-repeat; background-size: 0 1px; background-position: 0 100%; transition: background-size .18s ease, color .18s ease; }
a:hover { color: var(--accent-hover); background-size: 100% 1px; }
.section-label { font: 600 14px/1.4 var(--sans); letter-spacing: .08em; text-transform: uppercase; color: var(--accent); padding-bottom: 8px; border-bottom: 1px solid var(--line); margin: 0 0 18px; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; } }
```

- [ ] **Step 3: Header nav indicator and back-to-top**

```scss
.site-navigation a { position: relative; color: var(--ink); line-height: 44px; background: none; }
.site-navigation a::after { content: ""; position: absolute; left: 0; right: 0; bottom: 8px; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform .18s ease; }
.site-navigation a:hover::after, .site-navigation a[aria-current="page"]::after { transform: scaleX(1); }
.site-navigation a[aria-current="page"] { color: var(--accent); font-weight: 600; }
.back-to-top { position: fixed; right: 20px; bottom: 20px; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); background: var(--paper); color: var(--accent); cursor: pointer; opacity: 0; transform: translateY(8px); transition: opacity .2s, transform .2s; }
.back-to-top.is-visible { opacity: 1; transform: none; }
```

Layout footer markup:

```html
<footer class="site-footer">
  <span>&copy; {{ site.time | date: '%Y' }} {{ site.name }}.</span>
  <span>Built with <a href="https://jekyllrb.com/">Jekyll</a> · Updated {{ site.time | date: '%B %Y' }}.</span>
</footer>
<button class="back-to-top" type="button" aria-label="Back to top" hidden><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
```

JS (inside the existing IIFE, after the theme code):

```js
var topButton = document.querySelector(".back-to-top");
if (topButton) {
  topButton.hidden = false;
  var updateTop = function () { topButton.classList.toggle("is-visible", window.scrollY > window.innerHeight); };
  window.addEventListener("scroll", updateTop, { passive: true });
  updateTop();
  topButton.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
}
```

- [ ] **Step 4: Build, run both test suites, commit**

Run the global build command, `tests/check-build.rb`, `npm test`. Expected: all pass. Commit: `git commit -m "Switch academic theme to ink-blue tokens and nav indicator"`.

---

### Task 2: Avatar asset and share-card metadata

**Files:**
- Create: `images/avatar-600.jpg` (copy of `/tmp/shots/avatar-600.jpg`, 600×600, ~76 KB)
- Create: `_includes/academic-social-meta.html`
- Modify: `_config.yml` (`og_image: "avatar-600.jpg"`, `author.avatar: "avatar-600.jpg"`)
- Modify: `_layouts/academic.html` (include the meta partial)
- Modify: `_pages/about.md` (portrait uses `class="site-avatar"`, no CSS scaling)
- Modify: `_sass/_academic.scss` (`.profile-portrait` ring; remove the `transform: scale(1.4)` rule)
- Modify: `tests/check-build.rb` (selector `img.site-avatar`; assert `meta[property="og:image"]` exists on index)

**Interfaces:**
- Produces: `img.site-avatar` (tested), `meta[property="og:image"]` on every page.

- [ ] **Step 1: Write the failing build check**

In `tests/check-build.rb`, change the asset selector to `img.site-avatar` and add after the loop:

```ruby
home = Nokogiri::HTML(File.read(File.join(root, 'index.html')))
raise 'Avatar not versioned' unless home.at_css('img.site-avatar') && home.at_css('img.site-avatar')['src'].include?("v=#{version}")
og = home.at_css('meta[property="og:image"]')
raise 'Share image missing' unless og && og['content'].end_with?('/images/avatar-600.jpg')
puts 'Share image and avatar verified.'
```

Run the build check. Expected: FAIL with "Avatar not versioned".

- [ ] **Step 2: Add the asset, config, partial, and markup**

`_includes/academic-social-meta.html`:

```html
{% include base_path %}
{% if site.og_image %}
<meta property="og:image" content="{{ base_path }}/images/{{ site.og_image }}">
<meta property="og:image:alt" content="{{ site.name }}">
<meta name="twitter:card" content="summary">
<meta name="twitter:image" content="{{ base_path }}/images/{{ site.og_image }}">
{% endif %}
```

Portrait markup in `_pages/about.md`:

```html
<figure class="profile-portrait">
  <img class="site-avatar" src="{{ site.baseurl }}/images/avatar-600.jpg?v={{ site.time | date: '%s' }}" width="200" height="200" alt="Portrait of Yu Chen" fetchpriority="high">
</figure>
```

SCSS: `.profile-portrait { width: 200px; height: 200px; border-radius: 50%; padding: 4px; border: 2px solid var(--accent); } .site-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }`

- [ ] **Step 3: Build, run checks (expected PASS), commit** `Add pre-cropped avatar and share-card metadata`.

---

### Task 3: Publication data model and topics

**Files:**
- Modify: `_data/publications.yml` (add `id`, `topics`, `links`, `note`; rename `distinction` → `note`; remove `featured` from preprints; add `featured`/`featured_note` placeholders)
- Create: `_data/topics.yml`

**Interfaces:**
- Produces: schema documented in the spec; `site.data.topics` = list of `{slug, label, home}`.

- [ ] **Step 1: Write `_data/topics.yml`**

```yaml
- { slug: heavy-tailed, label: "Heavy-tailed & robust bandits", home: true }
- { slug: risk-sensitive, label: "Risk-sensitive RL", home: true }
- { slug: function-approximation, label: "RL with function approximation", home: true }
- { slug: generative, label: "Generative model theory", home: true }
- { slug: llm, label: "LLMs & distribution matching", home: true }
- { slug: scheduling, label: "Scheduling & networking", home: false }
```

- [ ] **Step 2: Rewrite each publication item**

Example (first item; repeat for all 16 with the ids listed in the enrichment job):

```yaml
- id: chen2025uniinf
  title: "uniINF: Best-of-Both-Worlds Algorithm for Parameter-Free Heavy-Tailed MABs"
  authors: ["Yu Chen*", "Jiatai Huang*", "Yan Dai*", "Longbo Huang"]
  year: 2025
  kind: publication
  venue: ICLR
  venue_full: "The Thirteenth International Conference on Learning Representations"
  note: "Spotlight, Top 5%"
  topics: [heavy-tailed]
  featured: true
  featured_note: "Parameter-free best-of-both-worlds bandits under heavy tails"
  links:
    - { label: Paper, url: "https://openreview.net/forum?id=2pNLknCTvG", kind: paper }
```

Topic assignments: skill→llm; context→llm; kmax→heavy-tailed; bobwmdp→heavy-tailed; powerflow→llm; actorcritic→function-approximation; ode→generative; interpolants→generative; uniinf→heavy-tailed; risk→risk-sensitive,function-approximation; pomdp→risk-sensitive; ton→scheduling; cvar→risk-sensitive,function-approximation; rewardfree→function-approximation; mobihoc→scheduling; linear→function-approximation.

Featured placeholders: `chen2025uniinf`, `chen2024risk`, `hu2023rewardfree`.

- [ ] **Step 3: Validate YAML and commit** `ruby -ryaml -e 'p YAML.load_file("_data/publications.yml").size'` → 16. Commit `Extend publication data with ids, topics, and link lists`.

---

### Task 4: Publications page, entry partial, filter script, tests

**Files:**
- Rewrite: `_includes/academic-paper.html`
- Create: `_includes/academic-pub-toolbar.html`
- Rewrite: `_pages/publications.md`
- Modify: `_sass/_academic.scss` (pub entry, pills, toolbar, details)
- Modify: `assets/js/academic.js` (expose `window.Academic` helpers; filter, year jump, BibTeX copy)
- Create: `tests/academic.test.cjs`
- Modify: `tests/check-build.rb` (structure checks)

**Interfaces:**
- Produces: `window.Academic = { parseTopic(search), matchesTopic(topicsAttr, topic), visibleIds(entries, topic) }` where `entries` is an array of `{ id, topics }`.
- DOM contract: `li.pub[id][data-topics="a b"][data-year="2025"]`, `.pub-toolbar button[data-topic]`, `.pub-toolbar a.year-jump[href="#year-2025"]`, `button.copy-bibtex[data-target]`.

- [ ] **Step 1: Write failing unit tests** `tests/academic.test.cjs`:

```js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

function load() {
  const source = fs.readFileSync(path.join(__dirname, "../assets/js/academic.js"), "utf8");
  const element = { addEventListener() {}, setAttribute() {}, getAttribute() { return null; }, classList: { toggle() {}, add() {}, remove() {} }, hidden: false };
  const document = {
    documentElement: { getAttribute() { return "light"; }, setAttribute() {} },
    querySelector() { return null; }, querySelectorAll() { return []; },
    addEventListener() {}, readyState: "complete", body: element
  };
  const window = { document, addEventListener() {}, location: { search: "", hash: "" }, history: { replaceState() {} }, scrollY: 0, innerHeight: 800 };
  vm.runInNewContext(source, { window, document, localStorage: { getItem() { return null; }, setItem() {} }, URL });
  return window.Academic;
}

test("parseTopic reads the topic query parameter and ignores unknown values", () => {
  const A = load();
  assert.equal(A.parseTopic("?topic=llm", ["llm", "generative"]), "llm");
  assert.equal(A.parseTopic("?topic=nope", ["llm"]), "all");
  assert.equal(A.parseTopic("", ["llm"]), "all");
});

test("matchesTopic treats 'all' as a wildcard and matches whole tokens only", () => {
  const A = load();
  assert.equal(A.matchesTopic("llm risk-sensitive", "all"), true);
  assert.equal(A.matchesTopic("llm risk-sensitive", "risk-sensitive"), true);
  assert.equal(A.matchesTopic("llm-agents", "llm"), false);
});

test("visibleIds returns the ids that survive a filter", () => {
  const A = load();
  const entries = [{ id: "a", topics: "llm" }, { id: "b", topics: "generative llm" }, { id: "c", topics: "scheduling" }];
  assert.deepEqual(A.visibleIds(entries, "llm"), ["a", "b"]);
  assert.deepEqual(A.visibleIds(entries, "all"), ["a", "b", "c"]);
});
```

Run `npm test`. Expected: FAIL (`Academic` undefined).

- [ ] **Step 2: Implement helpers and DOM wiring in `assets/js/academic.js`**

```js
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
    for (var i = 0; i < entries.length; i++) if (Academic.matchesTopic(entries[i].topics, topic)) ids.push(entries[i].id);
    return ids;
  }
};
window.Academic = Academic;
```

Filter wiring: on load, read chips (`.pub-toolbar [data-topic]`), compute `known`, apply `parseTopic(location.search)`, toggle `hidden` on each `li.pub` and on each `.publication-section` with no visible entries, set `aria-pressed` on chips, and `history.replaceState` the `?topic=` value. BibTeX copy: `navigator.clipboard.writeText(pre.textContent)` with a `textarea` + `execCommand("copy")` fallback; button label flips to "Copied" for 1.5 s.

- [ ] **Step 3: Entry partial** `_includes/academic-paper.html`:

```html
{% assign paper = include.paper %}
<li class="pub" id="{{ paper.id }}" data-year="{{ paper.year }}" data-topics="{{ paper.topics | join: ' ' }}">
  <div class="pub-meta"><span class="pub-venue">{% if paper.kind == 'preprint' %}arXiv{% else %}{{ paper.venue }}{% endif %}</span><span class="pub-year">{{ paper.year }}</span></div>
  <div class="pub-body">
    <p class="pub-title">{{ paper.title | escape_once }}</p>
    <p class="pub-authors">{% for author in paper.authors %}{% unless forloop.first %}{% if forloop.last %}, and {% else %}, {% endif %}{% endunless %}{% if author contains 'Yu Chen' %}<span class="pub-self">{{ author | escape_once }}</span>{% else %}{{ author | escape_once }}{% endif %}{% endfor %}.</p>
    <p class="pub-where"><span title="{{ paper.venue_full | escape_once }}">{{ paper.venue_full | escape_once }}</span>{% if paper.note %} <span class="pub-note">{{ paper.note }}</span>{% endif %}</p>
    <div class="pub-links">
      {% for link in paper.links %}<a class="pill pill-{{ link.kind }}" href="{{ link.url }}"><i class="{% case link.kind %}{% when 'code' %}fab fa-github{% when 'arxiv' %}ai ai-arxiv{% when 'slides' %}fas fa-chalkboard-teacher{% else %}fas fa-file-alt{% endcase %}" aria-hidden="true"></i>{{ link.label }}</a>{% endfor %}
      {% if paper.bibtex %}<button class="pill pill-bibtex" type="button" aria-expanded="false" aria-controls="bib-{{ paper.id }}"><i class="fas fa-quote-right" aria-hidden="true"></i>BibTeX</button>{% endif %}
    </div>
    {% if paper.bibtex %}<div class="pub-bibtex" id="bib-{{ paper.id }}" hidden><pre>{{ paper.bibtex | strip | escape_once }}</pre><button class="copy-bibtex" type="button" data-target="bib-{{ paper.id }}">Copy</button></div>{% endif %}
  </div>
</li>
```

- [ ] **Step 4: Page and toolbar**

`_includes/academic-pub-toolbar.html` renders `All` + one chip per topic that appears in the data, plus year jump links for each distinct year (anchors `id="year-YYYY"` placed on the first entry of each year inside each section). `_pages/publications.md` keeps the intro, includes the toolbar, then two `section.publication-section` blocks (Preprints, Publications) each with `ul.pub-list`.

- [ ] **Step 5: Build checks** in `tests/check-build.rb`:

```ruby
pubs = Nokogiri::HTML(File.read(File.join(root, 'publications/index.html')))
entries = pubs.css('li.pub')
raise 'Publication entries missing' unless entries.length == 16
raise 'Entry without topics or year' unless entries.all? { |e| e['data-topics'].to_s.strip != '' && e['data-year'].to_s =~ /\A\d{4}\z/ }
raise 'Entry without a Paper link' unless entries.all? { |e| e.at_css('.pub-links a.pill') }
raise 'Toolbar missing' unless pubs.at_css('.pub-toolbar [data-topic="all"]')
puts "publications: #{entries.length} entries with topics, years and links"
```

- [ ] **Step 6: Build, all tests pass, commit** `Rebuild publication entries with venue column, pills, filters, and BibTeX`.

---

### Task 5: Home page modules

**Files:**
- Rewrite: `_pages/about.md` (original wording restored from `git show master:_pages/about.md`)
- Create: `_data/news.yml`, `_includes/academic-news.html`, `_includes/academic-featured.html`, `_includes/academic-topic-tags.html`
- Modify: `_includes/academic-contact.html` (add CV link)
- Modify: `_sass/_academic.scss` (tags, cards, news, services column)
- Modify: `assets/js/academic.js` (news "Show all")
- Modify: `tests/check-build.rb` (3 cards, news count ≥ 6, tags present)

**Interfaces:**
- Consumes: `site.data.publications` (`featured`, `featured_note`, `venue`, `year`, `title`, `links[0].url`), `site.data.topics` (`home: true`), `site.data.news`.
- Produces: `.topic-tags a[href*="?topic="]`, `.featured-cards .card`, `.news-list li[data-index]`, `button.news-toggle`.

- [ ] **Step 1: Failing build checks** (cards == 3, `.news-list li` ≥ 6, `.topic-tags a` == 5). Run → FAIL.
- [ ] **Step 2: Data** `_data/news.yml` seeded from verified facts (arXiv months from the 2026-09-09 review; conference acceptances and scholarships at year precision), newest first.
- [ ] **Step 3: Page markup** in this order: name block → intro (original three paragraphs) + portrait → contact row → topic tags → Selected papers → Recent news → Research Interests (original bullets) → Academic Services. Services label column 200px.
- [ ] **Step 4: JS** news toggle: `li[data-index]` beyond 6 get `hidden` on load when a `.news-toggle` button exists; button toggles them and its label ("Show all news (N)" / "Show fewer").
- [ ] **Step 5: Build, tests pass, commit** `Restore original homepage text and add tags, featured papers, and news`.

---

### Task 6: Awards page

**Files:**
- Rewrite: `_pages/awards.md` (original text from `git show master:_pages/awards.md`, one row per award, 2021 and 2020 separate)
- Modify: `_sass/_academic.scss` (`.award-list`, `.year-badge`, icons)

- [ ] **Step 1: Markup** per row: `<li class="award award-{{type}}"><span class="year-badge">2024</span><i class="fas fa-graduation-cap" aria-hidden="true"></i><div><h3>…</h3><p>…<span class="pub-note">Top 2% domestically.</span></p></div></li>`; icons: `fa-trophy` research, `fa-graduation-cap` scholarship, `fa-flag` competition.
- [ ] **Step 2: Build check** awards page has ≥ 7 `li.award` rows with year badges. Build, tests pass, commit `Restore award text with year badges and type icons`.

---

### Task 7: Cleanup of the unused AcademicPages theme

**Files:**
- Delete: `_layouts/{single,archive,archive-taxonomy,splash,talk}.html`, unused `_includes/*` (everything except `academic-*`, `base_path`, `check-update.js`, `head.html`, `seo.html`, `analytics*`), `_sass/*.scss` except `_academic.scss`, `_sass/vendor/{breakpoint,susy,magnific-popup}`, `assets/css/main.scss`, `assets/css/collapse.css`, `assets/js/{main.min.js,_main.js,collapse.js,plugins}`, `_data/{authors,ui-text}.yml`, `_data/comments`, `_drafts`, `talkmap.ipynb`? (keep — user tool), `images/editing-talk.png`.
- Modify: `_includes/head.html` (link `academic.css` directly), `_layouts/academic.html`, `package.json` (drop uglify scripts and dependencies), `_config.yml` (remove `include: .htaccess`, comments providers etc. only if unused by remaining includes), `README.md`.
- Move: `design-qa.md` → `docs/design-qa-2026-09-09.md`.

- [ ] **Step 1:** `git rm` the files; grep the remaining templates for `{% include` / `@import` references to removed names; expected none.
- [ ] **Step 2:** Build, both test suites pass, the built `assets/css` contains only `academic.css` and `academicons.css`. Commit `Remove unused AcademicPages templates, styles, and scripts`.

---

### Task 8: Merge citation enrichment

**Files:**
- Modify: `_data/publications.yml` (add `arXiv` links and `bibtex` from `/tmp/pubs-enrichment.yml` after checking each `*_source`)

- [ ] **Step 1:** For each item with `confidence: high` or `medium` and a real source URL, add the arXiv pill and the BibTeX block; skip `generated` entries unless the metadata source is the official page. Record skipped items in the final report.
- [ ] **Step 2:** Build; `check-build.rb` still passes; commit `Add arXiv links and BibTeX entries from official sources`.

---

### Task 9: Verification and hand-off

- [ ] Build with the local URL override, serve on 4174, capture desktop (1280) and mobile (390, device emulation via an iframe host page or Playwright) screenshots of home, publications, awards in light and dark.
- [ ] Manually exercise: topic chips, `?topic=llm` deep link, year jump, news toggle, BibTeX copy, back-to-top, theme toggle, keyboard focus.
- [ ] Update `README.md` maintenance notes; write the memory note about the Homebrew Ruby path and the local `url` override; report open items (featured picks, topic check, news wording, skipped BibTeX).
