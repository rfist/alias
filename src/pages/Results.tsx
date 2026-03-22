import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store'

export default function Results() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const match = useGameStore((state) => state.match)
  const clearResultsPending = useGameStore((state) => state.clearResultsPending)

  // Clear the navigation flag when Results mounts (in case navigated here directly)
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
      <header className="mb-6 text-center">
        <p className="text-sm text-gray-500">{t('results.title')}</p>
        <p className="text-xl font-bold mt-1">{activeTeam?.name}</p>
        <p className="text-5xl font-black mt-2 tabular-nums">
          {lastGame?.points ?? 0}
        </p>
      </header>

      {/* Word history — full implementation in Step 8 */}
      {lastGame && (
        <ul className="flex flex-col gap-2 flex-1 overflow-y-auto mb-4">
          {lastGame.wordHistory.map((entry, i) => (
            <li
              key={i}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm
                ${entry.outcome === 'guessed' ? 'bg-green-50'
                  : entry.outcome === 'skipped' ? 'bg-red-50'
                  : 'bg-gray-50'}`}
            >
              <span className="font-medium">{entry.word}</span>
              <span className="text-xs text-gray-500">
                {entry.isLastWord && (
                  <span className="mr-1 text-red-500 font-bold">{t('results.label.last')}</span>
                )}
                {entry.isShared && (
                  <span className="mr-1 text-blue-500 font-bold">{t('results.label.shared')}</span>
                )}
                {t(`results.outcome.${entry.outcome === 'timed_out' ? 'timedOut' : entry.outcome}`)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleContinue}
        className="w-full rounded-2xl bg-yellow-400 py-4 text-lg font-black"
      >
        {t('results.continue')}
      </button>
    </main>
  )
}
