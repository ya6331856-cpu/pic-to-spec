import test from "node:test";
import assert from "node:assert/strict";
import { COUNTRY_PROFILES, formatCurrency, getCountryProfile, getPreferredUnitPair } from "../lib/country-settings.mjs";

test("country selector has all seven initial target countries", () => {
  assert.deepEqual(COUNTRY_PROFILES.map((country) => country.code), ["IN", "US", "GB", "CA", "AU", "AE", "SG"]);
});

test("unknown country safely falls back to India", () => {
  assert.equal(getCountryProfile("XX").code, "IN");
});

test("currency formatting follows selected country", () => {
  assert.equal(formatCurrency(180, "IN"), "₹180");
  assert.equal(formatCurrency(180, "US"), "$180");
  assert.equal(formatCurrency(180, "GB"), "£180");
  assert.equal(formatCurrency(180, "AE"), "AED 180");
});

test("US customary unit defaults differ from metric defaults", () => {
  assert.deepEqual(getPreferredUnitPair("length", "us-customary"), [6, 7]);
  assert.deepEqual(getPreferredUnitPair("weight", "us-customary"), [3, 4]);
  assert.deepEqual(getPreferredUnitPair("temperature", "us-customary"), [1, 0]);
  assert.deepEqual(getPreferredUnitPair("length", "metric"), [0, 1]);
});
