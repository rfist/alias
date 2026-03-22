import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store'

export default function Victory() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const match = useGameStore((state) => state.match)
  const abandonMatch = useGameStore((state) => state.abandonMatch)
  const startDraft = useGameStore((state) => state.startDraft)
  const uiLanguage = useGameStore((state) => state.uiLanguage)

  if (!match?.victory) {
    navigate('/')
    return null
  }

  const { teams, victory } = match
  const winners = teams.filter((t) => victory.winnerTeamIds.includes(t.id))
  const winnerScore = winners[0]?.score ?? 0
  const sorted = [...teams].sort((a, b) => b.score - a.score)

  function handleMenu() {
    abandonMatch()
    navigate('/')
  }

  function handlePlayAgain() {
    abandonMatch()
    startDraft(uiLanguage)
    navigate('/new-game/teams')
  }

  return (
    <main className="flex min-h-svh flex-col p-4 max-w-lg mx-auto">

      {/* Winner hero */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-48 h-48 rounded-full bg-yellow-400 flex flex-col items-center justify-center text-center p-4">
          <p className="text-xs font-bold tracking-widest text-yellow-700 uppercase">
            {winners.length > 1 ? t('victory.tiedWinners') : t('victory.winnerLabel')}
          </p>
          <p className="text-2xl font-black leading-tight mt-1">
            {winners.map((w) => w.name).join(' & ')}
          </p>
          <p className="text-4xl font-black tabular-nums mt-1">{winnerScore}</p>
        </div>
      </div>

      {/* Final standings */}
      <section aria-label={t('victory.finalStandings')} className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-2">
          {t('victory.finalStandings')}
        </h2>
        <ul className="flex flex-col gap-1">
          {sorted.map((team) => {
            const isWinner = victory.winnerTeamIds.includes(team.id)
            return (
              <li
                key={team.id}
                className={`flex justify-between rounded-lg px-3 py-2 text-sm
                  ${isWinner ? 'bg-yellow-100 font-bold' : 'bg-gray-50'}`}
              >
                <span>{team.name}</span>
                <span className="tabular-nums">{team.score}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleMenu}
          className="flex-1 rounded-xl border-2 py-3 font-semibold text-gray-700"
        >
          {t('victory.menu')}
        </button>
        <button
          onClick={handlePlayAgain}
          className="flex-1 rounded-xl bg-yellow-400 py-3 font-semibold"
        >
          {t('victory.playAgain')}
        </button>
      </div>
    </main>
  )
}
