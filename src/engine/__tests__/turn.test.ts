import { advanceTurn, isRoundComplete } from '../turn'
import type { Team, RoundTracking } from '../../types'

function makeTeam(id: string, order: number): Team {
  return { id, name: id, score: 0, order }
}

const teamA = makeTeam('a', 0)
const teamB = makeTeam('b', 1)
const teamC = makeTeam('c', 2)
const teams = [teamA, teamB, teamC]

describe('advanceTurn', () => {
  it('advances to the next team within the same round', () => {
    const current: RoundTracking = {
      currentRoundNumber: 1,
      currentRoundGameNumber: 1,
      activeTeamId: 'a',
    }
    const next = advanceTurn(teams, current)
    expect(next.activeTeamId).toBe('b')
    expect(next.currentRoundNumber).toBe(1)
    expect(next.currentRoundGameNumber).toBe(2)
  })

  it('wraps to the first team and increments round when last team finishes', () => {
    const current: RoundTracking = {
      currentRoundNumber: 1,
      currentRoundGameNumber: 3,
      activeTeamId: 'c', // last in order
    }
    const next = advanceTurn(teams, current)
    expect(next.activeTeamId).toBe('a')
    expect(next.currentRoundNumber).toBe(2)
    expect(next.currentRoundGameNumber).toBe(1)
  })

  it('works correctly with 2 teams', () => {
    const twoTeams = [teamA, teamB]
    const current: RoundTracking = {
      currentRoundNumber: 2,
      currentRoundGameNumber: 2,
      activeTeamId: 'b',
    }
    const next = advanceTurn(twoTeams, current)
    expect(next.activeTeamId).toBe('a')
    expect(next.currentRoundNumber).toBe(3)
    expect(next.currentRoundGameNumber).toBe(1)
  })
})

describe('isRoundComplete', () => {
  it('returns true when the last team in order just played', () => {
    const current: RoundTracking = {
      currentRoundNumber: 1,
      currentRoundGameNumber: 3,
      activeTeamId: 'c',
    }
    expect(isRoundComplete(teams, current)).toBe(true)
  })

  it('returns false when a non-last team just played', () => {
    const current: RoundTracking = {
      currentRoundNumber: 1,
      currentRoundGameNumber: 1,
      activeTeamId: 'a',
    }
    expect(isRoundComplete(teams, current)).toBe(false)
  })

  it('returns false for the second-to-last team', () => {
    const current: RoundTracking = {
      currentRoundNumber: 1,
      currentRoundGameNumber: 2,
      activeTeamId: 'b',
    }
    expect(isRoundComplete(teams, current)).toBe(false)
  })
})
