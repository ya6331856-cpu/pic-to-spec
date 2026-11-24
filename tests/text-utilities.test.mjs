import test from "node:test";
import assert from "node:assert/strict";
import { sortTextLines, removeDuplicateLines, reverseTextLines } from "../lib/text-utilities.mjs";

test("sorts lines naturally in ascending and descending order", () => {
  assert.equal(sortTextLines("item 10\nitem 2\nitem 1"), "item 1\nitem 2\nitem 10");
  assert.equal(sortTextLines("b\na\nc", "descending"), "c\nb\na");
});
test("sorts case-insensitively when requested", () => {
  assert.equal(sortTextLines("banana\nApple\napricot", "ascending", true), "Apple\napricot\nbanana");
});
test("removes duplicate lines and preserves first occurrence", () => {
  assert.equal(removeDuplicateLines("red\nblue\nred"), "red\nblue");
});
test("supports case-insensitive duplicate removal and trimming", () => {
  assert.equal(removeDuplicateLines(" Cat \ncat\nDog", true, true), "Cat\nDog");
});
test("can remove blank lines and reverse line order", () => {
  assert.equal(removeDuplicateLines("a\n\n b \n", false, true, true), "a\nb");
  assert.equal(reverseTextLines("one\ntwo\nthree"), "three\ntwo\none");
});
