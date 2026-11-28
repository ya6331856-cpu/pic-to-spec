import test from "node:test";
import assert from "node:assert/strict";
import { buildJsonDiff, createJsonDiffReport } from "../lib/json-diff.mjs";

test("ignores object key order but detects nested and scalar changes", () => {
  const before = { user: { name: "Aisha", active: true }, version: 1 };
  const after = { version: 2, user: { active: true, name: "Aisha" } };
  const diff = buildJsonDiff(before, after);

  assert.equal(diff.length, 1);
  assert.deepEqual(diff[0], {
    path: "$.version",
    pointer: "/version",
    kind: "Changed",
    before: 1,
    after: 2,
  });
});

test("reports added and removed properties with their full paths", () => {
  const diff = buildJsonDiff(
    { user: { name: "Aisha", role: "member" } },
    { user: { name: "Aisha", active: true } },
  );

  assert.deepEqual(diff.map(item => [item.path, item.pointer, item.kind]), [
    ["$.user.role", "/user/role", "Removed"],
    ["$.user.active", "/user/active", "Added"],
  ]);
});

test("compares arrays by index and reports inserted or removed positions", () => {
  const diff = buildJsonDiff(
    { items: ["a", "b"] },
    { items: ["a", "c", "d"] },
  );

  assert.deepEqual(diff.map(item => [item.path, item.pointer, item.kind]), [
    ["$.items[1]", "/items/1", "Changed"],
    ["$.items[2]", "/items/2", "Added"],
  ]);
});

test("marks a type change separately from a value change", () => {
  const diff = buildJsonDiff({ count: 1, label: "one" }, { count: "1", label: "two" });

  assert.deepEqual(diff.map(item => item.kind), ["Type changed", "Changed"]);
});

test("uses safe paths and RFC 6901 escaping for unusual property names", () => {
  const diff = buildJsonDiff(
    { "a.b": 1, "a/b~c": 2 },
    { "a.b": 3, "a/b~c": 4 },
  );

  assert.equal(diff.length, 2);
  assert.deepEqual(diff.map(item => item.pointer), ["/a.b", "/a~1b~0c"]);
  assert.equal(diff[0].path, '$["a.b"]');
});

test("distinguishes null, arrays, objects and root values", () => {
  assert.deepEqual(buildJsonDiff(null, {}), [
    { path: "$", pointer: "", kind: "Type changed", before: null, after: {} },
  ]);
  assert.equal(buildJsonDiff([1, 2], [1, 2]).length, 0);
  assert.equal(buildJsonDiff("x", "y")[0].kind, "Changed");
});

test("does not mutate either input", () => {
  const before = { list: [1, { value: "old" }] };
  const after = { list: [1, { value: "new" }] };
  const beforeCopy = structuredClone(before);
  const afterCopy = structuredClone(after);

  buildJsonDiff(before, after);

  assert.deepEqual(before, beforeCopy);
  assert.deepEqual(after, afterCopy);
});

test("exports an unfiltered summary with all change categories", () => {
  const diff = buildJsonDiff(
    { old: true, count: 1, shape: { x: 1 } },
    { count: "1", added: true, shape: { x: 2 } },
  );
  const report = createJsonDiffReport(diff);

  assert.deepEqual(report.summary, {
    total: 4,
    added: 1,
    removed: 1,
    changed: 1,
    typeChanged: 1,
  });
  assert.equal(report.tool, "PicToSpec JSON Diff");
  assert.equal(report.differences.length, 4);
});
