import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store'
import { useFocusOnMount } from '../hooks/useFocusOnMount'
import type { WordHistoryEntry, Team } from '../types'

export default function Results() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const headingRef = useFocusOnMount<HTMLHeadingElement>()

  const match = useGameStore((state) => state.match)
  const clearResultsPending = useGameStore((state) => state.clearResultsPending)

  useEffect(() => {
    clearResultsPending()
  }, [clearResultsPending])

  if (!match) {
    navigate('/')
    return null
  }

  const lastGame = match.completedRoundGames.at(-1)
  const activeTeam = lastGame
    ? match.teams.find((t) => t.id === lastGame.teamId)
    : null

  function handleContinue() {
    if (match!.victory) {
      navigate('/game/victory')
    } else {
      navigate('/game/prepare')
    }
  }

  return (
    <main className="flex min-h-svh flex-col p-4 max-w-lg mx-auto">

      {/* Header */}
      <header className="text-center mb-6">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-sm font-semibold uppercase tracking-widest text-gray-500 outline-none"
        >
          {t('results.title')}
        </h1>
        <p className="text-xl font-bold mt-1">{activeTeam?.name}</p>
        <p
          className="text-6xl font-black mt-2 tabular-nums"
          aria-label={`${lastGame?.points ?? 0} ${t('results.title')}`}
        >
          {lastGame?.points ?? 0}
        </p>
      </header>

      {/* Word history */}
      {lastGame && lastGame.wordHistory.length > 0 ? (
        <ol
          className="flex flex-col gap-2 flex-1 overflow-y-auto mb-4"
          aria-label={t('results.title')}
        >
          {lastGame.wordHistory.map((entry, i) => (
            <WordRow
              key={i}
              entry={entry}
              teams={match.teams}
            />
          ))}
        </ol>
      ) : (
        <p className="flex-1 text-center text-gray-400 py-8">—</p>
      )}

      <button
        onClick={handleContinue}
        className="w-full rounded-2xl bg-yellow-400 py-4 text-lg font-black
          active:scale-95 transition-transform"
      >
        {t('results.continue')}
      </button>
    </main>
  )
}

// ─── Word row ─────────────────────────────────────────────────────────────────

function WordRow({ entry, teams }: { entry: WordHistoryEntry; teams: Team[] }) {
  const { t } = useTranslation()

  const guessingTeam = entry.guessedByTeamId
    ? teams.find((t) => t.id === entry.guessedByTeamId)
    : null

  // Build a complete accessible description for screen readers
  const ariaDescription = [
    entry.word,
    t(`results.outcome.${entry.outcome === 'timed_out' ? 'timedOut' : entry.outcome}`),
    entry.isLastWord ? t('results.label.last') : '',
    entry.isShared ? t('results.label.shared') : '',
    guessingTeam
      ? t('results.label.guessedBy', { team: guessingTeam.name })
      : entry.isShared && entry.outcome === 'skipped'
        ? t('results.label.nobodyGuessed')
        : '',
  ].filter(Boolean).join('. ')

  const outcomeStyles = {
    guessed: 'bg-green-50 border-green-200',
    skipped: 'bg-red-50 border-red-200',
    timed_out: 'bg-gray-50 border-gray-200',
  }[entry.outcome]

  const outcomeIcon = {
    guessed: '✓',
    skipped: '✗',
    timed_out: '⏱',
  }[entry.outcome]

  const outcomeIconColor = {
    guessed: 'text-green-600',
    skipped: 'text-red-400',
    timed_out: 'text-gray-400',
  }[entry.outcome]

  return (
    <li
      className={`rounded-xl border px-3 py-2 ${outcomeStyles}`}
      aria-label={ariaDescription}
    >
      {/* Main row: word + outcome icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{entry.word}</span>
        <span className={`font-bold text-lg ${outcomeIconColor}`} aria-hidden="true">
          {outcomeIcon}
        </span>
      </div>

      {/* Metadata row: LAST / SHARED badges + team attribution */}
      {(entry.isLastWord || entry.isShared || guessingTeam ||
        (entry.isShared && entry.outcome === 'skipped')) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-1" aria-hidden="true">
          {entry.isLastWord && (
            <span className="text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded">
              {t('results.label.last')}
            </span>
          )}
          {entry.isShared && (
            <span className="text-xs bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded">
              {t('results.label.shared')}
            </span>
          )}
          {guessingTeam && (
            <span className="text-xs text-gray-600">
              {t('results.label.guessedBy', { team: guessingTeam.name })}
            </span>
          )}
          {entry.isShared && entry.outcome === 'skipped' && (
            <span className="text-xs text-gray-400">
              {t('results.label.nobodyGuessed')}
            </span>
          )}
        </div>
      )}
    </li>
  )
}
