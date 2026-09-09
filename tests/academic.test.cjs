const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

/* Loads assets/js/academic.js against a minimal DOM stub and returns the
   pure helpers it exposes on window.Academic. */
function load() {
  const source = fs.readFileSync(path.join(__dirname, "../assets/js/academic.js"), "utf8");
  const element = {
    addEventListener() {}, setAttribute() {}, getAttribute() { return null; },
    classList: { toggle() {}, add() {}, remove() {} }, hidden: false
  };
  const document = {
    documentElement: { getAttribute() { return "light"; }, setAttribute() {} },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    readyState: "complete",
    body: element
  };
  const window = {
    document, addEventListener() {},
    location: { search: "", hash: "", pathname: "/publications/" },
    history: { replaceState() {} },
    scrollY: 0, innerHeight: 800
  };
  const localStorage = { getItem() { return null; }, setItem() {} };
  vm.runInNewContext(source, { window, document, localStorage, URL, URLSearchParams, navigator: {}, setTimeout });
  return window.Academic;
}

test("parseTopic reads the topic query parameter and ignores unknown values", () => {
  const A = load();
  assert.equal(A.parseTopic("?topic=llm", ["llm", "generative"]), "llm");
  assert.equal(A.parseTopic("?year=2025&topic=generative#x", ["llm", "generative"]), "generative");
  assert.equal(A.parseTopic("?topic=nope", ["llm"]), "all");
  assert.equal(A.parseTopic("", ["llm"]), "all");
});

test("matchesTopic treats 'all' as a wildcard and matches whole tokens only", () => {
  const A = load();
  assert.equal(A.matchesTopic("llm risk-sensitive", "all"), true);
  assert.equal(A.matchesTopic("llm risk-sensitive", "risk-sensitive"), true);
  assert.equal(A.matchesTopic("llm-agents", "llm"), false);
  assert.equal(A.matchesTopic("", "llm"), false);
});

test("visibleIds returns the ids that survive a filter, in document order", () => {
  const A = load();
  const entries = [{ id: "a", topics: "llm" }, { id: "b", topics: "generative llm" }, { id: "c", topics: "scheduling" }];
  assert.deepEqual(Array.from(A.visibleIds(entries, "llm")), ["a", "b"]);
  assert.deepEqual(Array.from(A.visibleIds(entries, "all")), ["a", "b", "c"]);
  assert.deepEqual(Array.from(A.visibleIds(entries, "generative")), ["b"]);
});

test("topicUrl writes or removes the topic parameter without touching other parameters", () => {
  const A = load();
  assert.equal(A.topicUrl("/publications/", "?x=1", "llm"), "/publications/?x=1&topic=llm");
  assert.equal(A.topicUrl("/publications/", "?topic=llm&x=1", "all"), "/publications/?x=1");
  assert.equal(A.topicUrl("/publications/", "?topic=llm", "all"), "/publications/");
});
