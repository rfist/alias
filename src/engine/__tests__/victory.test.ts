import { checkVictory } from '../victory'
import type { Team } from '../../types'

function makeTeam(id: string, score: number): Team {
  return { id, name: id, score, order: 0 }
}

describe('checkVictory', () => {
  it('returns null when no team has reached the target', () => {
    const teams = [makeTeam('a', 40), makeTeam('b', 50)]
    expect(checkVictory(teams, 60)).toBeNull()
  })

  it('returns the winning team when one team reaches the target', () => {
    const teams = [makeTeam('a', 60), makeTeam('b', 40)]
    expect(checkVictory(teams, 60)).toEqual({ winnerTeamIds: ['a'] })
  })

  it('returns the highest scorer when multiple teams exceed target', () => {
    const teams = [makeTeam('a', 80), makeTeam('b', 70), makeTeam('c', 60)]
    expect(checkVictory(teams, 60)).toEqual({ winnerTeamIds: ['a'] })
  })

  it('returns all tied winners when multiple teams share the highest score', () => {
    const teams = [makeTeam('a', 70), makeTeam('b', 70), makeTeam('c', 50)]
    const result = checkVictory(teams, 60)
    expect(result?.winnerTeamIds).toHaveLength(2)
    expect(result?.winnerTeamIds).toContain('a')
    expect(result?.winnerTeamIds).toContain('b')
  })

  it('returns all teams as winners when all tie at target', () => {
    const teams = [makeTeam('a', 60), makeTeam('b', 60)]
    const result = checkVictory(teams, 60)
    expect(result?.winnerTeamIds).toHaveLength(2)
  })

  it('returns null when highest score is exactly one below target', () => {
    const teams = [makeTeam('a', 59), makeTeam('b', 30)]
    expect(checkVictory(teams, 60)).toBeNull()
  })
})
