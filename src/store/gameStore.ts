import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import {
  computeTurnPoints,
  checkVictory,
  createDeck,
  drawNextWord,
  advanceTurn,
  isRoundComplete,
} from '../engine'
import { DEFAULT_SETTINGS } from '../types'
import type {
  Match,
  NewGameDraft,
  AppLanguage,
  DictionaryLanguage,
  GameSettings,
  RoundGameState,
  WordHistoryEntry,
  Team,
} from '../types'

// ─── Initial state helpers ───────────────────────────────────────────────────

function makeIdleRoundGame(turnTimeSeconds: number): RoundGameState {
  return {
    status: 'idle',
    currentWord: null,
    guessedCount: 0,
    skippedCount: 0,
    wordHistory: [],
    timeRemainingMs: turnTimeSeconds * 1000,
    lastWordTimeRemainingMs: null,
    sharedLastWordPopup: null,
  }
}

// ─── Store shape ─────────────────────────────────────────────────────────────

export interface GameStore {
  match: Match | null
  draft: NewGameDraft | null
  uiLanguage: AppLanguage

  // Language
  setUiLanguage: (language: AppLanguage) => void

  // Wizard actions
  startDraft: (interfaceLanguage: AppLanguage) => void
  updateDraftTeams: (teams: NewGameDraft['teams']) => void
  updateDraftSettings: (patch: Partial<GameSettings>) => void
  setDraftDictionary: (id: string, language: DictionaryLanguage) => void
  createMatch: (words: string[]) => void

  // Round screen actions
  startTurn: () => void
  guessWord: () => void
  skipWord: () => void
  pauseTurn: () => void
  resumeTurn: () => void
  tick: (elapsedMs: number) => void
  resolveSharedLastWord: (guessedByTeamId: string) => void

  // Results screen action
  continueFromResults: () => void

  // Meta
  abandonMatch: () => void

  // Internal — not for direct use in components
  _finishTurn: () => void
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get) => ({
      match: null,
      draft: null,
      uiLanguage: 'en',

      setUiLanguage: (language) => {
        set((state) => { state.uiLanguage = language })
      },

      // ── Wizard ──────────────────────────────────────────────────────────

      startDraft: (interfaceLanguage) => {
        set((state) => {
          state.draft = {
            interfaceLanguage,
            dictionaryLanguage: interfaceLanguage,
            teams: [
              { id: nanoid(), name: 'Team 1', order: 0 },
              { id: nanoid(), name: 'Team 2', order: 1 },
            ],
            settings: { ...DEFAULT_SETTINGS },
            dictionaryId: null,
          }
        })
      },

      updateDraftTeams: (teams) => {
        set((state) => {
          if (state.draft) state.draft.teams = teams
        })
      },

      updateDraftSettings: (patch) => {
        set((state) => {
          if (state.draft) Object.assign(state.draft.settings, patch)
        })
      },

      setDraftDictionary: (id, language) => {
        set((state) => {
          if (state.draft) {
            state.draft.dictionaryId = id
            state.draft.dictionaryLanguage = language
          }
        })
      },

      // Called when the user selects a dictionary — finalizes the draft into a Match.
      // `words` is the full word list loaded from the dictionary asset.
      createMatch: (words) => {
        const { draft } = get()
        if (!draft || !draft.dictionaryId) return

        const teams: Team[] = draft.teams.map((t) => ({
          ...t,
          score: 0,
        }))

        const sorted = [...teams].sort((a, b) => a.order - b.order)

        set((state) => {
          state.draft = null
          state.match = {
            interfaceLanguage: draft.interfaceLanguage,
            dictionaryLanguage: draft.dictionaryLanguage,
            dictionaryId: draft.dictionaryId!,
            teams,
            settings: draft.settings,
            deck: createDeck(words),
            roundTracking: {
              currentRoundNumber: 1,
              currentRoundGameNumber: 1,
              activeTeamId: sorted[0].id,
            },
            currentRoundGame: makeIdleRoundGame(draft.settings.turnTimeSeconds),
            completedRoundGames: [],
            victory: null,
          }
        })
      },

      // ── Round screen ────────────────────────────────────────────────────

      startTurn: () => {
        set((state) => {
          if (!state.match) return
          const { word, deck } = drawNextWord(state.match.deck)
          state.match.deck = deck
          state.match.currentRoundGame.status = 'running'
          state.match.currentRoundGame.currentWord = word
        })
      },

      guessWord: () => {
        const { match } = get()
        if (!match) return

        const rg = match.currentRoundGame
        if (!rg.currentWord) return

        const { status } = rg

        if (status === 'running') {
          // Normal guess: record, draw next word
          set((state) => {
            const game = state.match!.currentRoundGame
            const entry: WordHistoryEntry = {
              word: game.currentWord!,
              orderIndex: game.wordHistory.length,
              outcome: 'guessed',
              isLastWord: false,
              isShared: false,
              guessedByTeamId: null,
            }
            game.wordHistory.push(entry)
            game.guessedCount++
            const { word, deck } = drawNextWord(state.match!.deck)
            state.match!.deck = deck
            game.currentWord = word
          })
        } else if (status === 'last_word') {
          // Last word, not shared: record as guessed, end turn
          set((state) => {
            const game = state.match!.currentRoundGame
            const entry: WordHistoryEntry = {
              word: game.currentWord!,
              orderIndex: game.wordHistory.length,
              outcome: 'guessed',
              isLastWord: true,
              isShared: false,
              guessedByTeamId: null,
            }
            game.wordHistory.push(entry)
            game.guessedCount++
            game.currentWord = null
            game.status = 'finished'
          })
          get()._finishTurn()
        } else if (status === 'shared_last_word') {
          // Open the "which team guessed it?" popup
          set((state) => {
            state.match!.currentRoundGame.sharedLastWordPopup = {
              word: rg.currentWord!,
            }
          })
        }
      },

      skipWord: () => {
        const { match } = get()
        if (!match) return

        const rg = match.currentRoundGame
        if (!rg.currentWord) return

        const { status } = rg

        if (status === 'running') {
          set((state) => {
            const game = state.match!.currentRoundGame
            const entry: WordHistoryEntry = {
              word: game.currentWord!,
              orderIndex: game.wordHistory.length,
              outcome: 'skipped',
              isLastWord: false,
              isShared: false,
              guessedByTeamId: null,
            }
            game.wordHistory.push(entry)
            game.skippedCount++
            const { word, deck } = drawNextWord(state.match!.deck)
            state.match!.deck = deck
            game.currentWord = word
          })
        } else if (status === 'last_word' || status === 'shared_last_word') {
          const isShared = status === 'shared_last_word'
          set((state) => {
            const game = state.match!.currentRoundGame
            const entry: WordHistoryEntry = {
              word: game.currentWord!,
              orderIndex: game.wordHistory.length,
              outcome: 'skipped',
              isLastWord: true,
              isShared,
              guessedByTeamId: null,
            }
            game.wordHistory.push(entry)
            // No penalty for shared skip (section 5.4), but still track the count
            game.skippedCount++
            game.currentWord = null
            game.sharedLastWordPopup = null
            game.status = 'finished'
          })
          get()._finishTurn()
        }
      },

      pauseTurn: () => {
        set((state) => {
          if (state.match?.currentRoundGame.status === 'running') {
            state.match.currentRoundGame.status = 'paused'
          }
        })
      },

      resumeTurn: () => {
        set((state) => {
          if (state.match?.currentRoundGame.status === 'paused') {
            state.match.currentRoundGame.status = 'running'
          }
        })
      },

      // Called by the useTimer hook every ~100ms while the turn is active.
      tick: (elapsedMs) => {
        const { match } = get()
        if (!match) return

        const rg = match.currentRoundGame
        const { status, timeRemainingMs, lastWordTimeRemainingMs } = rg
        const { lastWordExtraTime, sharedLastWordEnabled } = match.settings

        if (status === 'running') {
          const newTime = Math.max(0, timeRemainingMs - elapsedMs)

          if (newTime > 0) {
            set((state) => {
              state.match!.currentRoundGame.timeRemainingMs = newTime
            })
          } else {
            // Main timer ended — transition to last word state
            const newStatus = sharedLastWordEnabled ? 'shared_last_word' : 'last_word'
            const newLastWordMs =
              lastWordExtraTime === 'infinity'
                ? null
                : lastWordExtraTime === 0
                  ? 2000  // 2s grace window (section 5.5)
                  : lastWordExtraTime * 1000

            set((state) => {
              const game = state.match!.currentRoundGame
              game.status = newStatus
              game.timeRemainingMs = 0
              game.lastWordTimeRemainingMs = newLastWordMs
            })
          }
        } else if (
          (status === 'last_word' || status === 'shared_last_word') &&
          lastWordTimeRemainingMs !== null
        ) {
          const newLastWordTime = Math.max(0, lastWordTimeRemainingMs - elapsedMs)

          if (newLastWordTime > 0) {
            set((state) => {
              state.match!.currentRoundGame.lastWordTimeRemainingMs = newLastWordTime
            })
          } else {
            // Extra time expired — word is timed out (section 5.5)
            const word = rg.currentWord
            if (word) {
              set((state) => {
                const game = state.match!.currentRoundGame
                const entry: WordHistoryEntry = {
                  word,
                  orderIndex: game.wordHistory.length,
                  outcome: 'timed_out',
                  isLastWord: true,
                  isShared: status === 'shared_last_word',
                  guessedByTeamId: null,
                }
                game.wordHistory.push(entry)
                game.currentWord = null
                game.lastWordTimeRemainingMs = 0
                game.sharedLastWordPopup = null
                game.status = 'finished'
              })
              get()._finishTurn()
            }
          }
        }
      },

      // User selected a team in the shared-last-word popup.
      resolveSharedLastWord: (guessedByTeamId) => {
        const { match } = get()
        if (!match) return

        const rg = match.currentRoundGame
        const word = rg.sharedLastWordPopup?.word ?? rg.currentWord
        if (!word) return

        set((state) => {
          const game = state.match!.currentRoundGame
          const entry: WordHistoryEntry = {
            word,
            orderIndex: game.wordHistory.length,
            outcome: 'guessed',
            isLastWord: true,
            isShared: true,
            guessedByTeamId,
          }
          game.wordHistory.push(entry)
          game.guessedCount++
          game.currentWord = null
          game.sharedLastWordPopup = null
          game.status = 'finished'
        })
        get()._finishTurn()
      },

      // ── Results ─────────────────────────────────────────────────────────

      // Called when the user presses Continue on the Results screen.
      // By this point _finishTurn has already run; this just triggers navigation.
      // The component reads match.victory to decide where to go.
      continueFromResults: () => {
        // Navigation is handled by the component watching match.victory.
        // Nothing extra to do here for now — the state is already updated.
      },

      // ── Meta ────────────────────────────────────────────────────────────

      abandonMatch: () => {
        set((state) => {
          state.match = null
          state.draft = null
        })
      },

      // ── Internal ────────────────────────────────────────────────────────

      // Runs immediately after the last word is resolved (guessed, skipped, or timed out).
      // Computes scores, updates teams, checks victory, advances turn tracking.
      _finishTurn: () => {
        set((state) => {
          if (!state.match) return

          const { match } = state
          const { currentRoundGame, roundTracking, settings } = match
          const activeTeamId = roundTracking.activeTeamId

          // 1. Compute points for the active team
          const points = computeTurnPoints(
            currentRoundGame.wordHistory,
            settings,
            activeTeamId,
          )

          // 2. Record completed round game
          match.completedRoundGames.push({
            teamId: activeTeamId,
            roundNumber: roundTracking.currentRoundNumber,
            gameNumber: roundTracking.currentRoundGameNumber,
            points,
            wordHistory: currentRoundGame.wordHistory,
          })

          // 3. Apply points to active team
          const activeTeam = match.teams.find((t) => t.id === activeTeamId)
          if (activeTeam) activeTeam.score += points

          // 4. Apply +1 to another team if they guessed the shared last word
          const sharedGuessEntry = currentRoundGame.wordHistory.find(
            (e) => e.isShared && e.outcome === 'guessed' && e.guessedByTeamId !== activeTeamId,
          )
          if (sharedGuessEntry?.guessedByTeamId) {
            const otherTeam = match.teams.find(
              (t) => t.id === sharedGuessEntry.guessedByTeamId,
            )
            if (otherTeam) otherTeam.score += 1
          }

          // 5. Check victory (only after all teams complete the round)
          const roundComplete = isRoundComplete(match.teams, roundTracking)
          if (roundComplete) {
            const victoryResult = checkVictory(match.teams, settings.targetPoints)
            if (victoryResult) {
              match.victory = victoryResult
            }
          }

          // 6. Advance turn tracking
          const nextTracking = advanceTurn(match.teams, roundTracking)
          match.roundTracking = nextTracking

          // 7. Reset current round game for the next team
          match.currentRoundGame = makeIdleRoundGame(settings.turnTimeSeconds)
        })
      },
    })),
    {
      name: 'alias-game',  // localStorage key
    },
  ),
)
