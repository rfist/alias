// How a single word shown during a turn was resolved (section 5.2).
export type WordOutcome = 'guessed' | 'skipped' | 'timed_out'

// Full record of one word shown during a turn.
// Contains everything needed to render the Results screen exactly (section 12.2).
export interface WordHistoryEntry {
  word: string
  orderIndex: number            // position in the turn, used for ordered display
  outcome: WordOutcome
  isLastWord: boolean           // was this word active when the main timer ended?
  isShared: boolean             // was shared-last-word mode active for this word?
  guessedByTeamId: string | null // only set when isShared and outcome is 'guessed'
}

// Substates of the Round screen (section 7.1, 8.5).
export type RoundGameStatus =
  | 'idle'             // team is on screen, not yet started
  | 'running'          // timer counting down, words being shown
  | 'paused'           // timer frozen, only Continue is active
  | 'last_word'        // main timer ended, extra time counting (or infinity mode)
  | 'shared_last_word' // last word + shared mode active, popup may be shown
  | 'finished'         // turn is over, ready to go to Results

// State of the "which team guessed it?" popup shown during shared last word.
export interface SharedLastWordPopup {
  word: string
}

// Full state of the currently active team turn.
export interface RoundGameState {
  status: RoundGameStatus
  currentWord: string | null
  guessedCount: number
  skippedCount: number
  wordHistory: WordHistoryEntry[]
  timeRemainingMs: number       // main timer, counts down from turnTimeSeconds * 1000
  lastWordTimeRemainingMs: number | null  // null unless extra time is a fixed number
  sharedLastWordPopup: SharedLastWordPopup | null
}

// Immutable record stored after a turn ends, used for history and final scoring.
export interface CompletedRoundGame {
  teamId: string
  roundNumber: number
  gameNumber: number  // which game within the round (1 = first team, 2 = second, etc.)
  points: number      // final score for this turn after applying scoring formula
  wordHistory: WordHistoryEntry[]
}
