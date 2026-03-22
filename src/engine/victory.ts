import type { Team } from '../types'

// Determines whether the match is over and who won (section 5.6).
//
// Rules:
// - victory is only checked AFTER all teams complete the current round
//   (i.e. every team has played in this round)
// - if one or more teams have reached the target, the highest scorer wins
// - ties are allowed: all tied teams are winners
// - if nobody has reached the target yet, returns null (game continues)
export function checkVictory(
  teams: Team[],
  targetPoints: number,
): { winnerTeamIds: string[] } | null {
  const maxScore = Math.max(...teams.map(t => t.score))

  if (maxScore < targetPoints) {
    return null
  }

  const winners = teams.filter(t => t.score === maxScore)
  return { winnerTeamIds: winners.map(t => t.id) }
}
