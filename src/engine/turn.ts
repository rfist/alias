import type { Team, RoundTracking } from '../types'

// Computes the next RoundTracking state after the current team finishes their turn.
//
// Teams play in fixed cyclic order by `order` field.
// A round completes when every team has played once — then roundNumber increments
// and gameNumber resets to 1 (section 5, 18.5).
export function advanceTurn(
  teams: Team[],
  current: RoundTracking,
): RoundTracking {
  const sorted = [...teams].sort((a, b) => a.order - b.order)
  const currentIndex = sorted.findIndex(t => t.id === current.activeTeamId)
  const isLastTeamInRound = currentIndex === sorted.length - 1

  if (isLastTeamInRound) {
    return {
      currentRoundNumber: current.currentRoundNumber + 1,
      currentRoundGameNumber: 1,
      activeTeamId: sorted[0].id,
    }
  }

  return {
    currentRoundNumber: current.currentRoundNumber,
    currentRoundGameNumber: current.currentRoundGameNumber + 1,
    activeTeamId: sorted[currentIndex + 1].id,
  }
}

// Returns true if the just-finished turn was the last team's turn in the round.
// Victory can only be checked when this is true (section 5.6).
export function isRoundComplete(teams: Team[], current: RoundTracking): boolean {
  const sorted = [...teams].sort((a, b) => a.order - b.order)
  return sorted[sorted.length - 1].id === current.activeTeamId
}
