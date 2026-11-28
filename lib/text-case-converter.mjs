const SMALL_TITLE_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "nor",
  "of", "on", "or", "per", "the", "to", "up", "via", "vs",
]);

function upperFirst(value) {
  const chars = Array.from(value);
  if (!chars.length) return value;
  return chars[0].toLocaleUpperCase() + chars.slice(1).join("");
}

function splitWords(text) {
  const separated = String(text)
    .replace(/([\p{Ll}\p{N}])([\p{Lu}])/gu, "$1 $2")
    .replace(/([\p{Lu}])([\p{Lu}][\p{Ll}])/gu, "$1 $2");
  return separated.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? [];
}

function capitalizeEachWord(text) {
  return String(text)
    .toLocaleLowerCase()
    .replace(/(^|[^\p{L}\p{N}])([\p{L}])/gu, (_, separator, letter) =>
      separator + letter.toLocaleUpperCase()
    );
}

function toTitleCase(text) {
  const lower = String(text).toLocaleLowerCase();
  const tokens = lower.split(/(\s+)/u);
  const wordIndexes = tokens
    .map((token, index) => (/\S/u.test(token) ? index : -1))
    .filter(index => index >= 0);
  const first = wordIndexes[0];
  const last = wordIndexes[wordIndexes.length - 1];

  return tokens.map((token, index) => {
    if (!/\S/u.test(token)) return token;
    const clean = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    const isSmall = SMALL_TITLE_WORDS.has(clean);
    if (isSmall && index !== first && index !== last) return token;
    return token.replace(/\\p{L}/u, letter => letter.toLocaleUpperCase());
  }).join("");
}

function toSentenceCase(text) {
  let shouldCapitalize = true;
  return Array.from(String(text).toLocaleLowerCase()).map(character => {
    if (shouldCapitalize && /\p{L}/u.test(character)) {
      shouldCapitalize = false;
      return character.toLocaleUpperCase();
    }
    if (/[.!?]/u.test(character)) shouldCapitalize = true;
    return character;
  }).join("");
}

function toggleCase(text) {
  return Array.from(String(text)).map(character => {
    const upper = character.toLocaleUpperCase();
    const lower = character.toLocaleLowerCase();
    if (character === upper && character !== lower) return lower;
    if (character === lower && character !== upper) return upper;
    return character;
  }).join("");
}

function alternatingCase(text) {
  let upperNext = true;
  return Array.from(String(text)).map(character => {
    if (!/\p{L}/u.test(character)) return character;
    const result = upperNext ? character.toLocaleUpperCase() : character.toLocaleLowerCase();
    upperNext = !upperNext;
    return result;
  }).join("");
}

function collapseSpaces(text) {
  return String(text)
    .split(/\r?\n/u)
    .map(line => line.replace(/[^\S\r\n]+/gu, " ").trim())
    .join("\n");
}

export function convertTextCase(text, format) {
  const value = String(text ?? "");
  switch (format) {
    case "upper":
      return value.toLocaleUpperCase();
    case "lower":
      return value.toLocaleLowerCase();
    case "title":
      return toTitleCase(value);
    case "capitalize":
      return capitalizeEachWord(value);
    case "sentence":
      return toSentenceCase(value);
    case "toggle":
      return toggleCase(value);
    case "alternating":
      return alternatingCase(value);
    case "camel":
      return splitWords(value).map((word, index) =>
        index === 0 ? word.toLocaleLowerCase() : upperFirst(word.toLocaleLowerCase())
      ).join("");
    case "pascal":
      return splitWords(value).map(word => upperFirst(word.toLocaleLowerCase())).join("");
    case "snake":
      return splitWords(value).map(word => word.toLocaleLowerCase()).join("_");
    case "kebab":
      return splitWords(value).map(word => word.toLocaleLowerCase()).join("-");
    case "constant":
      return splitWords(value).map(word => word.toLocaleUpperCase()).join("_");
    case "spaces":
      return collapseSpaces(value);
    default:
      throw new RangeError(`Unsupported text case format: ${format}`);
  }
}

export const CASE_FORMATS = Object.freeze([
  "upper", "lower", "title", "capitalize", "sentence", "toggle",
  "alternating", "camel", "pascal", "snake", "kebab", "constant", "spaces",
]);
