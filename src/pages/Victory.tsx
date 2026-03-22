import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Victory() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <main className="flex min-h-svh flex-col p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('victory.winnerLabel')}</h1>
      <p className="text-gray-400">Victory screen — coming soon</p>
      <div className="mt-auto flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex-1 rounded-xl border py-3 font-semibold"
        >
          {t('victory.menu')}
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 rounded-xl bg-yellow-400 py-3 font-semibold"
        >
          {t('victory.playAgain')}
        </button>
      </div>
    </main>
  )
}
