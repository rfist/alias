import type { WordHistoryEntry, GameSettings } from '../types'

// Computes the points earned by the active team in a single turn (section 5.3, 5.4).
//
// Rules:
//   skip penalty OFF → points = guessed words
//   skip penalty ON  → points = guessed - skipped
//
// Special cases:
// - shared last word guessed by ANOTHER team → that team gets +1 directly (handled
//   in the store); the active team does NOT count it here
// - shared last word skipped → no penalty regardless of setting (section 5.4)
// - timed_out words contribute neither +1 nor -1
export function computeTurnPoints(
  wordHistory: WordHistoryEntry[],
  settings: Pick<GameSettings, 'skipPenaltyEnabled'>,
  activeTeamId: string,
): number {
  let guessed = 0
  let penalizedSkips = 0

  for (const entry of wordHistory) {
    if (entry.outcome === 'guessed') {
      // Shared last word guessed by another team → point goes to them, not here
      if (entry.isShared && entry.guessedByTeamId !== activeTeamId) continue
      guessed++
    } else if (entry.outcome === 'skipped') {
      // Shared last word skipped → no penalty regardless of setting (section 5.4)
      const isPenalized = settings.skipPenaltyEnabled && !entry.isShared
      if (isPenalized) penalizedSkips++
    }
    // timed_out → no contribution
  }

  return guessed - penalizedSkips
}
