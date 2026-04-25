import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store'
import WizardHeader from '../../components/WizardHeader'
import { getDictionariesByLanguage } from '../../data/dictionaries'
import { getDictionaryById } from '../../data/dictionaries'
import type { DictionaryLanguage } from '../../types'

export default function DictionariesStep() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { draft, match, setDraftDictionary, createMatch } = useGameStore()

  if (!draft && !match) {
    navigate('/')
    return null
  }

  const selectedLanguage = draft.dictionaryLanguage
  const dictionaries = getDictionariesByLanguage(selectedLanguage)

  function handleLanguageChange(lang: DictionaryLanguage) {
    // Clear selected dictionary when language changes
    setDraftDictionary('', lang)
  }

  function handleSelectDictionary(id: string) {
    const dict = getDictionaryById(id)
    if (!dict) return

    setDraftDictionary(id, dict.language)
    createMatch(dict.words)
    navigate('/game/prepare')
  }

  return (
    <main className="flex min-h-svh flex-col p-4 max-w-lg mx-auto">
      <WizardHeader title={t('wizard.dictionaries.title')} backTo="/new-game/settings" />

      {/* Dictionary language selector */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          {t('wizard.dictionaries.dictionaryLanguage')}
        </span>
        <div className="flex gap-1">
          {(['en', 'uk'] as DictionaryLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              aria-pressed={selectedLanguage === lang}
              className={`px-3 py-1 rounded-lg text-sm font-medium border transition-colors
                ${selectedLanguage === lang
                  ? 'bg-yellow-400 border-yellow-400 text-black'
                  : 'bg-white border-gray-200 text-gray-600'
                }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary list */}
      <ul className="flex flex-col gap-3" aria-label={t('wizard.dictionaries.title')}>
        {dictionaries.map((dict) => (
          <li key={dict.id}>
            <button
              onClick={() => handleSelectDictionary(dict.id)}
              className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3
                hover:border-yellow-400 hover:shadow-sm transition-all"
              aria-label={`${dict.title} — ${t(`wizard.dictionaries.difficulty.${dict.difficulty}`)}`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-bold">{dict.title}</span>
                <span className="text-xs font-semibold text-gray-500">
                  {t(`wizard.dictionaries.difficulty.${dict.difficulty}`)}
                </span>
              </div>
              <p className="text-sm text-gray-500">{dict.examples.join(', ')}</p>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
