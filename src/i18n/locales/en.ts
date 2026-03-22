import type { Translations } from '../types'

const en: Translations = {
  common: {
    back: 'Back',
    next: 'Next',
    continue: 'Continue',
    cancel: 'Cancel',
    menu: 'Menu',
  },

  mainMenu: {
    title: 'Alias',
    newGame: 'New Game',
    rules: 'Rules',
    language: 'Language',
    resumeGame: 'Resume Game',
  },

  rules: {
    title: 'Rules',
    lines: [
      'Explain words to your teammates before time runs out.',
      'You cannot use parts of the word or translations from other languages.',
      'One point for each correctly guessed word.',
      'Skipped words may reduce your score depending on settings.',
      'The first team to reach the target score wins — but all teams must complete the current round first.',
      'If multiple teams tie at the top, all tied teams win.',
    ],
  },

  wizard: {
    teams: {
      title: 'Teams',
      addTeam: 'Add team',
      removeTeam: 'Remove',
      randomizeName: 'Randomize',
      teamNameLabel: 'Team name',
      teamNamePlaceholder: 'Enter team name',
    },
    settings: {
      title: 'Settings',
      targetPoints: 'Number of Points',
      turnTime: 'Turn Time',
      turnTimeUnit: 'sec',
      skipPenalty: 'Skip Penalty',
      extraTime: 'Extra Time',
      extraTimeInfinity: '∞',
      sharedLastWord: 'Shared Last Word',
      sound: 'Sound',
    },
    dictionaries: {
      title: 'Dictionaries',
      dictionaryLanguage: 'Dictionary language',
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
    },
  },

  prepare: {
    leaderboard: 'Leaderboard',
    targetScore: 'Target: {{points}} pts',
    round: 'Round {{number}}',
    game: 'Game {{number}}',
    nextTeam: 'Next team',
    letsGo: "Let's go!",
  },

  round: {
    start: 'Start',
    continue: 'Continue',
    guessed: 'Guessed',
    skipped: 'Skipped',
    pause: 'Pause',
    lastLabel: 'LAST',
    sharedLabel: 'SHARED',
    guessedCount: 'Guessed',
    skippedCount: 'Skipped',
    sharedPopup: {
      title: 'Which team guessed the word?',
    },
    a11y: {
      newWord: 'New word: {{word}}',
      timerEnded: 'Time is up! Last word.',
      paused: 'Game paused.',
      resumed: 'Game resumed.',
    },
  },

  results: {
    title: 'Points scored',
    outcome: {
      guessed: 'Guessed',
      skipped: 'Skipped',
      timedOut: 'Time out',
    },
    label: {
      last: 'LAST',
      shared: 'SHARED',
      guessedBy: 'Guessed by {{team}}',
      nobodyGuessed: 'Nobody guessed',
    },
    continue: 'Continue',
  },

  victory: {
    winnerLabel: 'WINNER',
    tiedWinners: 'Tied winners',
    finalStandings: 'Final standings',
    playAgain: 'Play again',
    menu: 'Menu',
  },

  // Predefined team name pool for random generation
  teamNames: [
    'Red Hawks',
    'Blue Wolves',
    'Green Foxes',
    'Yellow Bears',
    'Purple Eagles',
    'Orange Lions',
    'Silver Sharks',
    'Golden Tigers',
  ],
}

export default en
