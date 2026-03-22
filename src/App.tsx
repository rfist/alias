import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useGameStore } from './store'
import i18n from './i18n'

// Syncs i18next language with the persisted store value on startup.
// This ensures that if the user last used the app in Ukrainian,
// the language is restored correctly before any component renders.
function LanguageSync() {
  const uiLanguage = useGameStore((state) => state.uiLanguage)

  useEffect(() => {
    if (i18n.language !== uiLanguage) {
      i18n.changeLanguage(uiLanguage)
    }
    // Keep <html lang="…"> in sync so assistive technology uses the right voice
    document.documentElement.lang = uiLanguage
  }, [uiLanguage])

  return null
}

export default function App() {
  return (
    <>
      <LanguageSync />
      <RouterProvider router={router} />
    </>
  )
}
