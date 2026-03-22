import type { AppLanguage, DictionaryLanguage } from './language'
import type { GameSettings } from './settings'
import type { Team } from './team'
import type { RoundGameState, CompletedRoundGame } from './round'

// Shuffled word pool consumed across the whole match (section 6.2).
export interface DeckState {
  shuffledWords: string[]
  currentIndex: number   // next word to draw
  cycleCount: number     // increments when deck wraps around; allows repeats
}

// Tracks which round and team is currently playing.
export interface RoundTracking {
  currentRoundNumber: number       // 1-based
  currentRoundGameNumber: number   // 1-based, resets each round
  activeTeamId: string
}

// Populated only when the game is over.
export interface VictoryData {
  winnerTeamIds: string[]  // one or more if tied (section 5.6)
}

// The full persisted game state (section 12.1).
// This is what gets written to and read from localStorage.
export interface Match {
  interfaceLanguage: AppLanguage
  dictionaryLanguage: DictionaryLanguage
  dictionaryId: string
  teams: Team[]
  settings: GameSettings
  deck: DeckState
  roundTracking: RoundTracking
  currentRoundGame: RoundGameState
  completedRoundGames: CompletedRoundGame[]
  victory: VictoryData | null
}

// Wizard accumulates this before the match starts (section 8.3).
// Teams here don't have scores yet — scores are added when Match is created.
export interface NewGameDraft {
  interfaceLanguage: AppLanguage
  dictionaryLanguage: DictionaryLanguage
  teams: Array<{ id: string; name: string; order: number }>
  settings: GameSettings
  dictionaryId: string | null
}
