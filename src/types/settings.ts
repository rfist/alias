// Extra time given after the main timer ends for the last word (section 5.5, 8.3.2).
// 'infinity' means the word stays active until guessed or skipped with no countdown.
export type ExtraTimeMode = 0 | 10 | 20 | 30 | 'infinity'

export interface GameSettings {
  targetPoints: number         // 10..200, step 10
  turnTimeSeconds: number      // 10..120, step 10
  skipPenaltyEnabled: boolean  // if true: points = guessed - skipped
  lastWordExtraTime: ExtraTimeMode
  sharedLastWordEnabled: boolean
  soundEnabled: boolean        // setting exists in MVP, behavior deferred
}

export const DEFAULT_SETTINGS: GameSettings = {
  targetPoints: 60,
  turnTimeSeconds: 60,
  skipPenaltyEnabled: true,
  lastWordExtraTime: 'infinity',
  sharedLastWordEnabled: true,
  soundEnabled: true,
}
