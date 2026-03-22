import type { Translations } from '../types'

const uk: Translations = {
  common: {
    back: 'Назад',
    next: 'Далі',
    continue: 'Продовжити',
    cancel: 'Скасувати',
    menu: 'Меню',
  },

  mainMenu: {
    title: 'Аліас',
    newGame: 'Нова гра',
    rules: 'Правила',
    language: 'Мова',
    resumeGame: 'Продовжити гру',
  },

  rules: {
    title: 'Правила',
    lines: [
      'Пояснюй слова своїй команді, поки не скінчився час.',
      'Не можна використовувати частини слова або переклади з інших мов.',
      'Одне очко за кожне правильно відгадане слово.',
      'Пропущені слова можуть зменшити рахунок залежно від налаштувань.',
      'Перша команда, що набере цільовий рахунок, перемагає — але всі команди мають завершити поточний раунд.',
      'Якщо кілька команд мають однаковий найвищий рахунок, усі вони виграють.',
    ],
  },

  wizard: {
    teams: {
      title: 'Команди',
      addTeam: 'Додати команду',
      removeTeam: 'Видалити',
      randomizeName: 'Випадково',
      teamNameLabel: 'Назва команди',
      teamNamePlaceholder: 'Введіть назву',
    },
    settings: {
      title: 'Налаштування',
      targetPoints: 'Кількість очок',
      turnTime: 'Час ходу',
      turnTimeUnit: 'сек',
      skipPenalty: 'Штраф за пропуск',
      extraTime: 'Додатковий час',
      extraTimeInfinity: '∞',
      sharedLastWord: 'Спільне останнє слово',
      sound: 'Звук',
    },
    dictionaries: {
      title: 'Словники',
      dictionaryLanguage: 'Мова словника',
      difficulty: {
        easy: 'Легкий',
        medium: 'Середній',
        hard: 'Важкий',
      },
    },
  },

  prepare: {
    leaderboard: 'Таблиця лідерів',
    targetScore: 'Ціль: {{points}} оч.',
    round: 'Раунд {{number}}',
    game: 'Гра {{number}}',
    nextTeam: 'Наступна команда',
    letsGo: 'Поїхали!',
  },

  round: {
    start: 'Старт',
    continue: 'Продовжити',
    guessed: 'Вгадано',
    skipped: 'Пропущено',
    pause: 'Пауза',
    lastLabel: 'ОСТАННЄ',
    sharedLabel: 'СПІЛЬНЕ',
    guessedCount: 'Вгадано',
    skippedCount: 'Пропущено',
    sharedPopup: {
      title: 'Яка команда вгадала слово?',
    },
    a11y: {
      newWord: 'Нове слово: {{word}}',
      timerEnded: 'Час вийшов! Останнє слово.',
      paused: 'Гру призупинено.',
      resumed: 'Гру відновлено.',
    },
  },

  results: {
    title: 'Набрано очок',
    outcome: {
      guessed: 'Вгадано',
      skipped: 'Пропущено',
      timedOut: 'Час вийшов',
    },
    label: {
      last: 'ОСТАННЄ',
      shared: 'СПІЛЬНЕ',
      guessedBy: 'Вгадала {{team}}',
      nobodyGuessed: 'Ніхто не вгадав',
    },
    continue: 'Продовжити',
  },

  victory: {
    winnerLabel: 'ПЕРЕМОЖЕЦЬ',
    tiedWinners: 'Нічия переможців',
    finalStandings: 'Фінальний рахунок',
    playAgain: 'Зіграти ще',
    menu: 'Меню',
  },

  teamNames: [
    'Червоні яструби',
    'Сині вовки',
    'Зелені лисиці',
    'Жовті ведмеді',
    'Пурпурові орли',
    'Помаранчеві леви',
    'Срібні акули',
    'Золоті тигри',
  ],
}

export default uk
