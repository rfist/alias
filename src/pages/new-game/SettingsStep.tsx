import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function SettingsStep() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <main className="flex min-h-svh flex-col p-6 max-w-lg mx-auto">
      <button onClick={() => navigate('/new-game/teams')} className="self-start mb-6 text-sm">
        ← {t('common.back')}
      </button>
      <h1 className="text-2xl font-bold mb-4">{t('wizard.settings.title')}</h1>
      <p className="text-gray-400">Settings step — coming soon</p>
      <button
        onClick={() => navigate('/new-game/dictionaries')}
        className="mt-auto w-full rounded-xl bg-yellow-400 py-3 font-semibold"
      >
        {t('common.next')}
      </button>
    </main>
  )
}
