export function calculateSIP(monthlyInvestment, annualRatePercent, years) {
  const p = Number(monthlyInvestment), annual = Number(annualRatePercent), y = Number(years);
  if (![p, annual, y].every(Number.isFinite) || p <= 0 || annual < 0 || y <= 0 || y > 100) throw new Error("Enter a positive monthly investment, a non-negative return rate and a duration up to 100 years.");
  const months = Math.round(y * 12), rate = annual / 1200;
  const value = rate === 0 ? p * months : p * ((Math.pow(1 + rate, months) - 1) / rate);
  const invested = p * months;
  return { invested, estimatedValue: value, estimatedReturns: value - invested, months };
}

export function calculateFixedDeposit(principal, annualRatePercent, years, compoundsPerYear = 4) {
  const p = Number(principal), annual = Number(annualRatePercent), y = Number(years), n = Number(compoundsPerYear);
  if (![p, annual, y, n].every(Number.isFinite) || p <= 0 || annual < 0 || y <= 0 || y > 100 || ![1, 2, 4, 12, 365].includes(n)) throw new Error("Enter a positive deposit, a non-negative rate, a duration up to 100 years and a valid compounding frequency.");
  const value = p * Math.pow(1 + annual / (100 * n), n * y);
  return { principal: p, maturityValue: value, interestEarned: value - p };
}

export function calculateRecurringDeposit(monthlyDeposit, annualRatePercent, years) {
  const p = Number(monthlyDeposit), annual = Number(annualRatePercent), y = Number(years);
  if (![p, annual, y].every(Number.isFinite) || p <= 0 || annual < 0 || y <= 0 || y > 100) throw new Error("Enter a positive monthly deposit, a non-negative rate and a duration up to 100 years.");
  const months = Math.round(y * 12), monthlyRate = annual / 1200;
  // Monthly compounding estimate with deposits assumed at each month-end.
  const value = monthlyRate === 0 ? p * months : p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const invested = p * months;
  return { invested, maturityValue: value, interestEarned: value - invested, months };
}

export function calculateProfit(cost, sellingPrice) {
  const c = Number(cost), s = Number(sellingPrice);
  if (![c, s].every(Number.isFinite) || c <= 0 || s < 0) throw new Error("Enter a cost greater than zero and a selling price of zero or more.");
  const profit = s - c;
  return { cost: c, sellingPrice: s, profit, marginPercent: s === 0 ? null : (profit / s) * 100, markupPercent: (profit / c) * 100 };
}

export function calculateHourlyRate(targetMonthlyIncome, monthlyExpenses, billableHoursPerWeek, taxPercent = 0) {
  const income = Number(targetMonthlyIncome), expenses = Number(monthlyExpenses), hours = Number(billableHoursPerWeek), tax = Number(taxPercent);
  if (![income, expenses, hours, tax].every(Number.isFinite) || income < 0 || expenses < 0 || hours <= 0 || hours > 168 || tax < 0 || tax >= 100) throw new Error("Enter valid income, expenses, 1–168 billable hours per week and a tax estimate from 0% to below 100%.");
  const annualBillableHours = hours * 52;
  const requiredAnnualRevenue = (income + expenses) * 12 / (1 - tax / 100);
  return { annualBillableHours, requiredAnnualRevenue, hourlyRate: requiredAnnualRevenue / annualBillableHours };
}

export function calculateInterest(principal, annualRatePercent, years, compoundsPerYear = 1) {
  const p = Number(principal), annual = Number(annualRatePercent), y = Number(years), n = Number(compoundsPerYear);
  if (![p, annual, y, n].every(Number.isFinite) || p <= 0 || annual < 0 || y <= 0 || y > 100 || ![1, 2, 4, 12, 365].includes(n)) throw new Error("Enter a positive principal, a non-negative rate, a duration up to 100 years and a valid compounding frequency.");
  const simpleInterest = p * (annual / 100) * y;
  const compoundValue = p * Math.pow(1 + annual / (100 * n), n * y);
  return { principal: p, simpleInterest, simpleTotal: p + simpleInterest, compoundInterest: compoundValue - p, compoundTotal: compoundValue };
}
