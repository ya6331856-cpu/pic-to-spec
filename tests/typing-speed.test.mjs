import test from "node:test";
import assert from "node:assert/strict";
import { calculateTypingStats } from "../lib/typing-speed.mjs";

test("calculates correct characters, errors, accuracy and net WPM", () => {
  const result = calculateTypingStats("hello world", "hello worle", 60);
  assert.deepEqual(result, {
    typedCharacters: 11,
    correctCharacters: 10,
    errors: 1,
    accuracy: 91,
    wordsPerMinute: 2
  });
});

test("counts extra typed characters as errors", () => {
  const result = calculateTypingStats("cat", "cats", 30);
  assert.equal(result.correctCharacters, 3);
  assert.equal(result.errors, 1);
  assert.equal(result.accuracy, 75);
});

test("handles empty input and zero elapsed time", () => {
  assert.deepEqual(calculateTypingStats("target", "", 0), {
    typedCharacters: 0,
    correctCharacters: 0,
    errors: 0,
    accuracy: 0,
    wordsPerMinute: 0
  });
});

test("returns zero WPM when elapsed time is zero", () => {
  assert.equal(calculateTypingStats("hello", "hello", 0).wordsPerMinute, 0);
});

test("rejects invalid arguments", () => {
  assert.throws(() => calculateTypingStats(10, "text", 30), TypeError);
  assert.throws(() => calculateTypingStats("text", "text", -1), RangeError);
  assert.throws(() => calculateTypingStats("text", "text", Number.NaN), RangeError);
});
