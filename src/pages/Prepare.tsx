import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store'

export default function Prepare() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const match = useGameStore((state) => state.match)

  if (!match) {
    navigate('/')
    return null
  }

  const { teams, settings, roundTracking } = match
  const activeTeam = teams.find((t) => t.id === roundTracking.activeTeamId)!

  // Leaderboard sorted by score descending
  const sorted = [...teams].sort((a, b) => b.score - a.score)

  return (
    <main className="flex min-h-svh flex-col p-4 max-w-lg mx-auto">

      {/* Leaderboard */}
      <section aria-label={t('prepare.leaderboard')}>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-base font-bold text-gray-700">{t('prepare.leaderboard')}</h2>
          <span className="text-xs text-gray-500">
            {t('prepare.targetScore', { points: settings.targetPoints })}
          </span>
        </div>

        <ul className="flex flex-col gap-1 mb-6">
          {sorted.map((team) => (
            <li
              key={team.id}
              className={`flex justify-between items-center rounded-lg px-3 py-2 text-sm
                ${team.id === activeTeam.id
                  ? 'bg-yellow-100 font-semibold'
                  : 'bg-gray-50'
                }`}
            >
              <span>{team.name}</span>
              <span className="font-bold tabular-nums">{team.score}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Round info */}
      <div className="text-center text-sm text-gray-500 mb-1">
        {t('prepare.round', { number: roundTracking.currentRoundNumber })}
        {' · '}
        {t('prepare.game', { number: roundTracking.currentRoundGameNumber })}
      </div>

      {/* Active team hero block */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
          {t('prepare.nextTeam')}
        </p>
        <p
          className="text-4xl font-black text-center"
          aria-label={`${t('prepare.nextTeam')}: ${activeTeam.name}`}
        >
          {activeTeam.name}
        </p>
      </div>

      {/* Let's go button */}
      <button
        onClick={() => navigate('/game/round')}
        className="w-full rounded-2xl bg-yellow-400 py-4 text-xl font-black tracking-wide
          active:scale-95 transition-transform"
      >
        {t('prepare.letsGo')}
      </button>
    </main>
  )
}
