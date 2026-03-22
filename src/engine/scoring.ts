import type { WordHistoryEntry } from '../types'
import type { GameSettings } from '../types'

// Computes the points earned in a single turn (section 5.3).
//
// Rules:
//   skip penalty OFF → points = guessed words
//   skip penalty ON  → points = guessed - skipped
//
// Notes:
// - result may be negative (no floor at zero)
// - shared last word skipped has no penalty (section 5.4) — the caller
//   must not count that skip in the wordHistory entry for this purpose,
//   OR we detect it here by checking isShared + outcome === 'skipped'
// - timed_out words contribute neither +1 nor -1
export function computeTurnPoints(
  wordHistory: WordHistoryEntry[],
  settings: Pick<GameSettings, 'skipPenaltyEnabled'>,
): number {
  let guessed = 0
  let penalizedSkips = 0

  for (const entry of wordHistory) {
    if (entry.outcome === 'guessed') {
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
