import { computeTurnPoints } from '../scoring'
import type { WordHistoryEntry } from '../../types'

const ACTIVE_TEAM = 'team-1'
const OTHER_TEAM = 'team-2'

function word(
  outcome: WordHistoryEntry['outcome'],
  overrides: Partial<WordHistoryEntry> = {},
): WordHistoryEntry {
  return {
    word: 'test',
    orderIndex: 0,
    outcome,
    isLastWord: false,
    isShared: false,
    guessedByTeamId: null,
    ...overrides,
  }
}

describe('computeTurnPoints', () => {
  describe('skip penalty disabled', () => {
    const settings = { skipPenaltyEnabled: false }

    it('counts only guessed words', () => {
      const history = [word('guessed'), word('guessed'), word('skipped')]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(2)
    })

    it('returns 0 when nothing guessed', () => {
      const history = [word('skipped'), word('skipped')]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(0)
    })

    it('ignores timed_out words', () => {
      const history = [word('guessed'), word('timed_out')]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(1)
    })
  })

  describe('skip penalty enabled', () => {
    const settings = { skipPenaltyEnabled: true }

    it('subtracts skipped from guessed', () => {
      const history = [word('guessed'), word('guessed'), word('skipped')]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(1)
    })

    it('allows negative scores', () => {
      const history = [word('guessed'), word('skipped'), word('skipped'), word('skipped')]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(-2)
    })

    it('returns 0 for empty turn', () => {
      expect(computeTurnPoints([], settings, ACTIVE_TEAM)).toBe(0)
    })

    it('ignores timed_out words', () => {
      const history = [word('guessed'), word('timed_out'), word('skipped')]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(0)
    })
  })

  describe('shared last word skip penalty exemption', () => {
    const settings = { skipPenaltyEnabled: true }

    it('does not penalize a skipped shared last word', () => {
      const history = [
        word('guessed'),
        word('skipped', { isLastWord: true, isShared: true }),
      ]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(1)
    })

    it('penalizes a skipped non-shared last word normally', () => {
      const history = [
        word('guessed'),
        word('skipped', { isLastWord: true, isShared: false }),
      ]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(0)
    })

    it('counts shared last word guessed by the active team', () => {
      const history = [
        word('guessed'),
        word('guessed', { isLastWord: true, isShared: true, guessedByTeamId: ACTIVE_TEAM }),
      ]
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(2)
    })

    it('does NOT count shared last word guessed by another team', () => {
      const history = [
        word('guessed'),
        word('guessed', { isLastWord: true, isShared: true, guessedByTeamId: OTHER_TEAM }),
      ]
      // Other team's point is applied directly to them in the store, not here
      expect(computeTurnPoints(history, settings, ACTIVE_TEAM)).toBe(1)
    })
  })
})
