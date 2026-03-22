import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Rules() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const lines = t('rules.lines', { returnObjects: true }) as string[]

  return (
    <main className="flex min-h-svh flex-col p-6 max-w-lg mx-auto">
      <button onClick={() => navigate('/')} className="self-start mb-6 text-sm">
        ← {t('common.back')}
      </button>
      <h1 className="text-2xl font-bold mb-4">{t('rules.title')}</h1>
      <ul className="space-y-3">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-yellow-500 font-bold">{i + 1}.</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
