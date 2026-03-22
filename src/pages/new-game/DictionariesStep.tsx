import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function DictionariesStep() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <main className="flex min-h-svh flex-col p-6 max-w-lg mx-auto">
      <button onClick={() => navigate('/new-game/settings')} className="self-start mb-6 text-sm">
        ← {t('common.back')}
      </button>
      <h1 className="text-2xl font-bold mb-4">{t('wizard.dictionaries.title')}</h1>
      <p className="text-gray-400">Dictionaries step — coming soon</p>
    </main>
  )
}
