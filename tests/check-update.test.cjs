const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "../_includes/check-update.js"), "utf8");
const current = "1788930000";
const newer = "1788930001";
const flush = () => new Promise(setImmediate);
const response = (version) => ({ ok: true, json: async () => ({ version }) });

function page(options = {}) {
  const requests = [];
  const redirects = [];
  const listeners = {};
  const historyState = { scroll: 120 };
  const location = {
    href: options.url || "https://custyhs.github.io/publications/?topic=rl#preprints",
    replace(url) { redirects.push(new URL(url)); }
  };
  const history = {
    state: historyState,
    replaceState(state, title, url) {
      assert.equal(state, historyState);
      if (options.restrictHistory) throw new Error("History unavailable");
      location.href = url;
    }
  };
  const window = {
    URL, location, history,
    fetch: async (url, config) => {
      requests.push({ url: new URL(url), config });
      return options.fetch ? options.fetch(requests.length) : response(options.latest || current);
    },
    addEventListener(name, callback) { listeners[name] = callback; }
  };
  const document = {
    querySelector: () => ({
      content: options.current || current,
      getAttribute: () => options.manifestPath || "/version.json"
    })
  };
  vm.runInNewContext(source, { window, document });
  return { requests, redirects, location, pageshow: (persisted) => listeners.pageshow({ persisted }) };
}

test("each initial load checks a fresh same-origin manifest without reloading an unchanged page", async () => {
  const browser = page();
  await flush();
  assert.equal(browser.requests.length, 1);
  assert.equal(browser.requests[0].url.pathname, "/version.json");
  assert.ok(browser.requests[0].url.searchParams.get("check"));
  assert.equal(browser.requests[0].config.cache, "no-store");
  assert.equal(browser.requests[0].config.mode, "same-origin");
  assert.equal(browser.redirects.length, 0);
  browser.pageshow(false);
  await flush();
  assert.equal(browser.requests.length, 1);
});

test("a newer build reloads the same page with a fresh URL and preserves queries and anchors", async () => {
  const browser = page({ latest: newer });
  await flush();
  assert.equal(browser.redirects.length, 1);
  const target = browser.redirects[0];
  assert.equal(target.origin, "https://custyhs.github.io");
  assert.equal(target.pathname, "/publications/");
  assert.equal(target.searchParams.get("topic"), "rl");
  assert.equal(target.hash, "#preprints");
  assert.match(target.searchParams.get("__site_version"), new RegExp(`^${newer}-[a-z0-9]+$`));
});

test("a stale CDN manifest cannot downgrade a newer page", async () => {
  const browser = page({ current: newer, latest: current });
  await flush();
  assert.equal(browser.redirects.length, 0);
});

test("successful updates remove only the internal marker and preserve history state", async () => {
  const browser = page({
    current: newer, latest: newer,
    url: `https://custyhs.github.io/publications/?topic=rl&__site_version=${newer}-nonce#preprints`
  });
  await flush();
  assert.equal(browser.location.href, "https://custyhs.github.io/publications/?topic=rl#preprints");
  assert.equal(browser.redirects.length, 0);
});

test("an incompletely propagated deployment cannot cause repeated reloads", async () => {
  const browser = page({
    latest: newer,
    url: `https://custyhs.github.io/?__site_version=${newer}-nonce`
  });
  await flush();
  assert.equal(browser.redirects.length, 0);
  assert.equal(browser.location.href, "https://custyhs.github.io/");
  const olderManifest = page({
    latest: newer,
    url: "https://custyhs.github.io/?__site_version=1788930002-nonce"
  });
  await flush();
  assert.equal(olderManifest.redirects.length, 0);
});

test("returning through back/forward cache checks again and detects a deployment", async () => {
  const browser = page({ fetch: (count) => response(count === 1 ? current : newer) });
  await flush();
  browser.pageshow(true);
  await flush();
  assert.equal(browser.requests.length, 2);
  assert.notEqual(browser.requests[0].url.href, browser.requests[1].url.href);
  assert.equal(browser.redirects.length, 1);
});

test("an older in-flight check cannot override a check started after history restoration", async () => {
  const pending = [];
  const browser = page({ fetch: () => new Promise((resolve) => pending.push(resolve)) });
  browser.pageshow(true);
  pending[1](response(current));
  await flush();
  pending[0](response(newer));
  await flush();
  assert.equal(browser.redirects.length, 0);
});

test("failed requests and malformed manifests leave the current page usable", async () => {
  const failures = [
    async () => { throw new Error("Offline"); },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => { throw new Error("Not JSON"); } }),
    async () => response("https://example.com/"),
    async () => response(Number(newer)),
    async () => ({ ok: true, json: async () => null })
  ];
  for (const fetch of failures) {
    const browser = page({ fetch });
    await flush();
    assert.equal(browser.redirects.length, 0);
  }
});

test("project sites use their configured base path and do not require the history API", async () => {
  const browser = page({
    latest: newer, restrictHistory: true,
    url: `https://custyhs.github.io/project/?__site_version=${newer}-nonce`,
    manifestPath: "/project/version.json"
  });
  await flush();
  assert.equal(browser.requests[0].url.href.split("?")[0], "https://custyhs.github.io/project/version.json");
  assert.equal(browser.redirects.length, 0);
});
