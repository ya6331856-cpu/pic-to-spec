export interface TypingStats {
  typedCharacters: number;
  correctCharacters: number;
  errors: number;
  accuracy: number;
  wordsPerMinute: number;
}

export function calculateTypingStats(
  targetText: string,
  typedText: string,
  elapsedSeconds: number
): TypingStats;
