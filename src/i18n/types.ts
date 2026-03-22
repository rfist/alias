// Defines the expected shape of a translation resource.
// Both en.ts and uk.ts must satisfy this interface.
// Using `string` (not string literals) so any language can implement it.
export interface Translations {
  common: {
    back: string
    next: string
    continue: string
    cancel: string
    menu: string
  }
  mainMenu: {
    title: string
    newGame: string
    rules: string
    language: string
    resumeGame: string
  }
  rules: {
    title: string
    lines: string[]
  }
  wizard: {
    teams: {
      title: string
      addTeam: string
      removeTeam: string
      randomizeName: string
      teamNameLabel: string
      teamNamePlaceholder: string
    }
    settings: {
      title: string
      targetPoints: string
      turnTime: string
      turnTimeUnit: string
      skipPenalty: string
      extraTime: string
      extraTimeInfinity: string
      sharedLastWord: string
      sound: string
    }
    dictionaries: {
      title: string
      dictionaryLanguage: string
      difficulty: {
        easy: string
        medium: string
        hard: string
      }
    }
  }
  prepare: {
    leaderboard: string
    targetScore: string
    round: string
    game: string
    nextTeam: string
    letsGo: string
  }
  round: {
    start: string
    continue: string
    guessed: string
    skipped: string
    pause: string
    lastLabel: string
    sharedLabel: string
    guessedCount: string
    skippedCount: string
    sharedPopup: {
      title: string
    }
    a11y: {
      newWord: string
      timerEnded: string
      paused: string
      resumed: string
    }
  }
  results: {
    title: string
    outcome: {
      guessed: string
      skipped: string
      timedOut: string
    }
    label: {
      last: string
      shared: string
      guessedBy: string
      nobodyGuessed: string
    }
    continue: string
  }
  victory: {
    winnerLabel: string
    tiedWinners: string
    finalStandings: string
    playAgain: string
    menu: string
  }
  teamNames: string[]
}
