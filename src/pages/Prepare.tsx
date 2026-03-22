import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Prepare() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <main className="flex min-h-svh flex-col p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('prepare.leaderboard')}</h1>
      <p className="text-gray-400">Prepare screen — coming soon</p>
      <button
        onClick={() => navigate('/game/round')}
        className="mt-auto w-full rounded-xl bg-yellow-400 py-3 font-semibold"
      >
        {t('prepare.letsGo')}
      </button>
    </main>
  )
}
