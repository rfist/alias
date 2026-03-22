import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import uk from './locales/uk'

// Resources are typed via the Translations type from en.ts.
// Adding a new language is: add a file matching Translations shape, register here.
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    // React already escapes values — no need for i18next to do it too
    escapeValue: false,
  },
})

export default i18n
