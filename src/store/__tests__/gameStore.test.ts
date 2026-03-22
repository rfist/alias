import { beforeEach, vi } from 'vitest'
import { useGameStore } from '../gameStore'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WORDS = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape']

function setupMatch(overrides: { targetPoints?: number; skipPenalty?: boolean } = {}) {
  const store = useGameStore.getState()
  store.startDraft('en')

  // Fix team IDs and names for deterministic tests
  useGameStore.setState((state) => {
    if (state.draft) {
      state.draft.teams = [
        { id: 'team-a', name: 'Alpha', order: 0 },
        { id: 'team-b', name: 'Beta', order: 1 },
      ]
      if (overrides.targetPoints !== undefined) {
        state.draft.settings.targetPoints = overrides.targetPoints
      }
      if (overrides.skipPenalty !== undefined) {
        state.draft.settings.skipPenaltyEnabled = overrides.skipPenalty
      }
    }
  })

  store.setDraftDictionary('quick', 'en')
  store.createMatch(WORDS)
}

function getState() {
  return useGameStore.getState()
}

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Reset store to initial state between tests
  useGameStore.setState({ match: null, draft: null })
  vi.restoreAllMocks()
})

// ─── Wizard ───────────────────────────────────────────────────────────────────

describe('wizard', () => {
  it('startDraft initializes a draft with two teams and default settings', () => {
    getState().startDraft('en')
    const { draft } = getState()
    expect(draft).not.toBeNull()
    expect(draft!.teams).toHaveLength(2)
    expect(draft!.settings.targetPoints).toBe(60)
  })

  it('createMatch produces a match with teams at score 0', () => {
    setupMatch()
    const { match } = getState()
    expect(match).not.toBeNull()
    expect(match!.teams.every((t) => t.score === 0)).toBe(true)
    expect(match!.roundTracking.activeTeamId).toBe('team-a')
    expect(match!.victory).toBeNull()
  })

  it('createMatch clears the draft', () => {
    setupMatch()
    expect(getState().draft).toBeNull()
  })
})

// ─── Turn lifecycle ───────────────────────────────────────────────────────────

describe('turn lifecycle', () => {
  beforeEach(() => setupMatch())

  it('startTurn sets status to running and shows a word', () => {
    getState().startTurn()
    const rg = getState().match!.currentRoundGame
    expect(rg.status).toBe('running')
    expect(rg.currentWord).not.toBeNull()
  })

  it('guessWord records the word and shows the next one', () => {
    getState().startTurn()
    const firstWord = getState().match!.currentRoundGame.currentWord
    getState().guessWord()
    const rg = getState().match!.currentRoundGame
    expect(rg.guessedCount).toBe(1)
    expect(rg.currentWord).not.toBe(firstWord)
    expect(rg.wordHistory[0].outcome).toBe('guessed')
  })

  it('skipWord records the word and shows the next one', () => {
    getState().startTurn()
    getState().skipWord()
    const rg = getState().match!.currentRoundGame
    expect(rg.skippedCount).toBe(1)
    expect(rg.wordHistory[0].outcome).toBe('skipped')
  })

  it('pauseTurn freezes status', () => {
    getState().startTurn()
    getState().pauseTurn()
    expect(getState().match!.currentRoundGame.status).toBe('paused')
  })

  it('resumeTurn restores running status', () => {
    getState().startTurn()
    getState().pauseTurn()
    getState().resumeTurn()
    expect(getState().match!.currentRoundGame.status).toBe('running')
  })
})

// ─── Timer ───────────────────────────────────────────────────────────────────

describe('tick', () => {
  beforeEach(() => setupMatch())

  it('decrements timeRemainingMs', () => {
    getState().startTurn()
    const before = getState().match!.currentRoundGame.timeRemainingMs
    getState().tick(500)
    const after = getState().match!.currentRoundGame.timeRemainingMs
    expect(after).toBe(before - 500)
  })

  it('transitions to shared_last_word when main timer reaches 0', () => {
    getState().startTurn()
    getState().tick(999999)
    expect(getState().match!.currentRoundGame.status).toBe('shared_last_word')
  })

  it('transitions to last_word when sharedLastWord is disabled', () => {
    useGameStore.setState((state) => {
      if (state.match) state.match.settings.sharedLastWordEnabled = false
    })
    getState().startTurn()
    getState().tick(999999)
    expect(getState().match!.currentRoundGame.status).toBe('last_word')
  })
})

// ─── Scoring and turn advancement ────────────────────────────────────────────

describe('_finishTurn / scoring', () => {
  it('applies guessed points to the active team', () => {
    setupMatch()
    getState().startTurn()
    getState().guessWord()
    getState().guessWord()
    // Simulate timer ending with no more words
    getState().tick(999999)
    getState().skipWord() // skip the last word to end the turn
    const teamA = getState().match!.teams.find((t) => t.id === 'team-a')
    expect(teamA!.score).toBe(2)
  })

  it('advances to the next team after turn ends', () => {
    setupMatch()
    getState().startTurn()
    getState().tick(999999)
    getState().skipWord()
    expect(getState().match!.roundTracking.activeTeamId).toBe('team-b')
  })

  it('increments round number after all teams play', () => {
    setupMatch()
    // Team A's turn
    getState().startTurn()
    getState().tick(999999)
    getState().skipWord()
    // Team B's turn
    getState().startTurn()
    getState().tick(999999)
    getState().skipWord()
    expect(getState().match!.roundTracking.currentRoundNumber).toBe(2)
    expect(getState().match!.roundTracking.activeTeamId).toBe('team-a')
  })

  it('appends an entry to completedRoundGames after each turn', () => {
    setupMatch()
    getState().startTurn()
    getState().tick(999999)
    getState().skipWord()
    expect(getState().match!.completedRoundGames).toHaveLength(1)
    expect(getState().match!.completedRoundGames[0].teamId).toBe('team-a')
  })
})

// ─── Shared last word ─────────────────────────────────────────────────────────

describe('shared last word', () => {
  beforeEach(() => setupMatch())

  it('guessWord during shared_last_word opens popup', () => {
    getState().startTurn()
    getState().tick(999999)
    getState().guessWord()
    expect(getState().match!.currentRoundGame.sharedLastWordPopup).not.toBeNull()
  })

  it('resolveSharedLastWord by active team gives point to active team', () => {
    getState().startTurn()
    getState().tick(999999)
    getState().guessWord() // open popup
    getState().resolveSharedLastWord('team-a')
    const teamA = getState().match!.teams.find((t) => t.id === 'team-a')
    expect(teamA!.score).toBe(1)
  })

  it('resolveSharedLastWord by other team gives point to other team only', () => {
    getState().startTurn()
    getState().tick(999999)
    getState().guessWord()
    getState().resolveSharedLastWord('team-b')
    const teamA = getState().match!.teams.find((t) => t.id === 'team-a')
    const teamB = getState().match!.teams.find((t) => t.id === 'team-b')
    expect(teamA!.score).toBe(0)
    expect(teamB!.score).toBe(1)
  })

  it('skipWord during shared_last_word ends turn with no penalty', () => {
    setupMatch({ skipPenalty: true })
    getState().startTurn()
    getState().tick(999999)
    getState().skipWord() // skip the shared last word
    const teamA = getState().match!.teams.find((t) => t.id === 'team-a')
    // No guessed words, no penalty for shared skip → 0
    expect(teamA!.score).toBe(0)
    // But skippedCount is still tracked
    expect(getState().match!.completedRoundGames[0].wordHistory[0].isShared).toBe(true)
  })
})

// ─── Victory ─────────────────────────────────────────────────────────────────

describe('victory', () => {
  it('sets victory after the round completes if a team reached target', () => {
    setupMatch({ targetPoints: 1 })

    // Team A guesses one word
    getState().startTurn()
    getState().guessWord()
    getState().tick(999999)
    getState().skipWord()

    // Victory not set yet — team B hasn't played
    expect(getState().match!.victory).toBeNull()

    // Team B's turn — guesses nothing
    getState().startTurn()
    getState().tick(999999)
    getState().skipWord()

    expect(getState().match!.victory).not.toBeNull()
    expect(getState().match!.victory!.winnerTeamIds).toContain('team-a')
  })
})

// ─── Meta ─────────────────────────────────────────────────────────────────────

describe('abandonMatch', () => {
  it('clears match and draft', () => {
    setupMatch()
    getState().abandonMatch()
    expect(getState().match).toBeNull()
    expect(getState().draft).toBeNull()
  })
})
