import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store'
import { useFocusOnMount } from '../hooks/useFocusOnMount'
import type { AppLanguage } from '../types'
import i18n from '../i18n'

export default function MainMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const headingRef = useFocusOnMount<HTMLHeadingElement>()
  const { uiLanguage, setUiLanguage, startDraft, match } = useGameStore()

  function handleLanguageChange(lang: AppLanguage) {
    setUiLanguage(lang)
    i18n.changeLanguage(lang)
  }

  function handleNewGame() {
    startDraft(uiLanguage)
    navigate('/new-game/teams')
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <h1 ref={headingRef} tabIndex={-1} className="text-4xl font-bold outline-none">
        {t('mainMenu.title')}
      </h1>

      <div className="flex gap-2">
        <button
          onClick={() => handleLanguageChange('en')}
          aria-pressed={uiLanguage === 'en'}
          className="rounded px-3 py-1 border"
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange('uk')}
          aria-pressed={uiLanguage === 'uk'}
          className="rounded px-3 py-1 border"
        >
          UK
        </button>
      </div>

      {match && (
        <button
          onClick={() => navigate('/game/prepare')}
          className="w-full max-w-xs rounded-xl bg-gray-200 py-3 font-semibold"
        >
          {t('mainMenu.resumeGame')}
        </button>
      )}

      <button
        onClick={handleNewGame}
        className="w-full max-w-xs rounded-xl bg-yellow-400 py-3 font-semibold"
      >
        {t('mainMenu.newGame')}
      </button>

      <button
        onClick={() => navigate('/rules')}
        className="w-full max-w-xs rounded-xl border py-3 font-semibold"
      >
        {t('mainMenu.rules')}
      </button>
    </main>
  )
}
