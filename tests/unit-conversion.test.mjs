import test from "node:test";
import assert from "node:assert/strict";
import { convertTemperature, isBelowAbsoluteZero } from "../lib/unit-conversion.mjs";

test("converts Fahrenheit to Celsius", () => {
  assert.equal(convertTemperature(32, 1, 0), 0);
});

test("converts Kelvin to Celsius", () => {
  assert.equal(convertTemperature(273.15, 2, 0), 0);
});

test("converts Celsius to Fahrenheit", () => {
  assert.equal(convertTemperature(100, 0, 1), 212);
});

test("accepts absolute zero in all supported scales", () => {
  assert.equal(isBelowAbsoluteZero(-273.15, 0), false);
  assert.equal(isBelowAbsoluteZero(-459.67, 1), false);
  assert.equal(isBelowAbsoluteZero(0, 2), false);
});

test("rejects temperatures below absolute zero", () => {
  assert.equal(isBelowAbsoluteZero(-273.16, 0), true);
  assert.equal(isBelowAbsoluteZero(-459.68, 1), true);
  assert.equal(isBelowAbsoluteZero(-0.01, 2), true);
});
