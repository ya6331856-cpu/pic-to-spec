export function calculateTypingStats(targetText, typedText, elapsedSeconds) {
  if (typeof targetText !== "string" || typeof typedText !== "string") {
    throw new TypeError("Target and typed text must be strings.");
  }
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
    throw new RangeError("Elapsed time must be zero or greater.");
  }

  let correctCharacters = 0;
  const comparedLength = Math.min(targetText.length, typedText.length);
  for (let index = 0; index < comparedLength; index += 1) {
    if (targetText[index] === typedText[index]) correctCharacters += 1;
  }

  const typedCharacters = typedText.length;
  const errors = typedCharacters - correctCharacters;
  const accuracy = typedCharacters === 0
    ? 0
    : Math.round((correctCharacters / typedCharacters) * 100);
  const wordsPerMinute = elapsedSeconds === 0
    ? 0
    : Math.round((correctCharacters / 5) / (elapsedSeconds / 60));

  return {
    typedCharacters,
    correctCharacters,
    errors,
    accuracy,
    wordsPerMinute
  };
}
