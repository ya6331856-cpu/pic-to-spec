import test from "node:test";
import assert from "node:assert/strict";
import { calculateSIP, calculateFixedDeposit, calculateRecurringDeposit, calculateProfit, calculateHourlyRate, calculateInterest } from "../lib/finance-calculators.mjs";

test("SIP handles zero return and monthly contributions", () => {
  const result = calculateSIP(1000, 0, 1);
  assert.equal(result.invested, 12000);
  assert.equal(result.estimatedValue, 12000);
});
test("SIP calculates positive estimated returns", () => {
  assert.ok(calculateSIP(5000, 12, 10).estimatedReturns > 0);
});
test("FD quarterly compounding", () => {
  const result = calculateFixedDeposit(10000, 8, 1, 4);
  assert.ok(result.maturityValue > 10800);
  assert.equal(result.interestEarned, result.maturityValue - 10000);
});
test("RD zero-rate estimate equals total deposits", () => {
  assert.equal(calculateRecurringDeposit(1000, 0, 2).maturityValue, 24000);
});
test("profit margin and markup are distinct", () => {
  const result = calculateProfit(80, 100);
  assert.equal(result.profit, 20);
  assert.equal(result.marginPercent, 20);
  assert.equal(result.markupPercent, 25);
});
test("hourly rate includes tax and monthly expenses", () => {
  const result = calculateHourlyRate(3000, 500, 20, 20);
  assert.equal(result.annualBillableHours, 1040);
  assert.ok(result.hourlyRate > 50);
});
test("simple and compound interest outputs", () => {
  const result = calculateInterest(10000, 10, 2, 4);
  assert.equal(result.simpleTotal, 12000);
  assert.ok(result.compoundTotal > result.simpleTotal);
});
test("rejects invalid financial inputs", () => {
  assert.throws(() => calculateSIP(0, 10, 5));
  assert.throws(() => calculateFixedDeposit(1000, -1, 2));
  assert.throws(() => calculateProfit(0, 100));
  assert.throws(() => calculateHourlyRate(1000, 0, 0));
  assert.throws(() => calculateInterest(1000, 5, 2, 3));
});
