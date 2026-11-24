export function isBelowAbsoluteZero(value, fromIndex) {
  if (!Number.isFinite(value)) return false;
  if (fromIndex === 0) return value < -273.15;
  if (fromIndex === 1) return value < -459.67;
  return value < 0;
}

export function convertTemperature(value, fromIndex, toIndex) {
  const celsius = fromIndex === 0
    ? value
    : fromIndex === 1
      ? (value - 32) * 5 / 9
      : value - 273.15;

  if (toIndex === 0) return celsius;
  if (toIndex === 1) return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}
