import test from "node:test";
import assert from "node:assert/strict";
import { compareText } from "../lib/text-compare.mjs";
import { cleanCsv } from "../lib/csv-cleaner.mjs";

test("text compare marks added, removed and unchanged lines", () => {
  const result = compareText("alpha\nold\nomega", "alpha\nnew\nomega");
  assert.deepEqual(result.stats, { added: 1, removed: 1, unchanged: 2 });
  assert.deepEqual(result.lines.map(line => line.type), ["unchanged", "removed", "added", "unchanged"]);
});

test("text compare normalizes Windows line endings and trailing newline", () => {
  const result = compareText("one\r\ntwo\r\n", "one\ntwo");
  assert.deepEqual(result.stats, { added: 0, removed: 0, unchanged: 2 });
});

test("text compare handles empty and identical content", () => {
  assert.deepEqual(compareText("", "").stats, { added: 0, removed: 0, unchanged: 0 });
  assert.deepEqual(compareText("same", "same").stats, { added: 0, removed: 0, unchanged: 1 });
});

test("text compare refuses oversized comparisons", () => {
  assert.throws(() => compareText("a\nb", "c\nd", 2), /too large to compare/);
});

test("CSV cleaner trims cells, removes blank rows and duplicate records", () => {
  const result = cleanCsv("name, city\n Asha , Delhi \n,\nAsha,Delhi\nRavi,Mumbai");
  assert.equal(result.csv, "name,city\r\nAsha,Delhi\r\nRavi,Mumbai");
  assert.equal(result.inputRows, 4);
  assert.equal(result.outputRows, 2);
  assert.equal(result.duplicatesRemoved, 1);
  assert.equal(result.blankRowsRemoved, 1);
  assert.equal(result.trimmedCells, 3);
});

test("CSV cleaner preserves quoted commas, quotes and line breaks", () => {
  const result = cleanCsv('name,note\nAsha,"Delhi, India"\nRavi,"said ""hello"""\nMina,"line 1\nline 2"', { spreadsheetSafe: false });
  assert.match(result.csv, /"Delhi, India"/);
  assert.match(result.csv, /"said ""hello"""/);
  assert.match(result.csv, /"line 1\r?\nline 2"/);
});

test("CSV cleaner protects spreadsheet formula-like cells by default", () => {
  const result = cleanCsv("name,value\nAsha,=1+1");
  assert.equal(result.csv, "name,value\r\nAsha,'=1+1");
});

test("CSV cleaner rejects inconsistent column counts and malformed CSV", () => {
  assert.throws(() => cleanCsv("a,b\n1,2,3"), /same number of columns/);
  assert.throws(() => cleanCsv('a,b\n1,"open'), /unclosed quoted field/);
});
