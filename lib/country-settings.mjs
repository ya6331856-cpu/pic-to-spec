export const COUNTRY_PROFILES = Object.freeze([
  { code: "IN", name: "India", flag: "🇮🇳", locale: "en-IN", currency: "INR", dateFormat: "DD/MM/YYYY", measurementSystem: "metric" },
  { code: "US", name: "United States", flag: "🇺🇸", locale: "en-US", currency: "USD", dateFormat: "MM/DD/YYYY", measurementSystem: "us-customary" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", locale: "en-GB", currency: "GBP", dateFormat: "DD/MM/YYYY", measurementSystem: "metric" },
  { code: "CA", name: "Canada", flag: "🇨🇦", locale: "en-CA", currency: "CAD", dateFormat: "YYYY-MM-DD", measurementSystem: "metric" },
  { code: "AU", name: "Australia", flag: "🇦🇺", locale: "en-AU", currency: "AUD", dateFormat: "DD/MM/YYYY", measurementSystem: "metric" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", locale: "en-AE", currency: "AED", dateFormat: "DD/MM/YYYY", measurementSystem: "metric" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", locale: "en-SG", currency: "SGD", dateFormat: "DD/MM/YYYY", measurementSystem: "metric" }
]);

export function getCountryProfile(countryCode = "IN") {
  const normalized = String(countryCode || "IN").toUpperCase();
  return COUNTRY_PROFILES.find((country) => country.code === normalized) || COUNTRY_PROFILES[0];
}

export function formatCurrency(amount, countryOrCode = "IN") {
  if (!Number.isFinite(Number(amount))) return "—";
  const country = typeof countryOrCode === "string" ? getCountryProfile(countryOrCode) : countryOrCode;
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(amount));
}

const UNIT_PAIRS = {
  metric: {
    length: [0, 1],
    weight: [0, 1],
    temperature: [0, 1],
    volume: [0, 1],
    area: [0, 1],
    data: [0, 1]
  },
  "us-customary": {
    length: [6, 7],
    weight: [3, 4],
    temperature: [1, 0],
    volume: [2, 4],
    area: [2, 3],
    data: [0, 1]
  }
};

export function getPreferredUnitPair(category, measurementSystem = "metric") {
  const system = measurementSystem === "us-customary" ? "us-customary" : "metric";
  const pair = UNIT_PAIRS[system][category] || [0, 1];
  return [...pair];
}
