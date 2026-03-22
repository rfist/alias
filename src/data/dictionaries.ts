import type { Dictionary } from '../types'
import enQuickWords from '../assets/dictionaries/en-quick.json'
import ukQuickWords from '../assets/dictionaries/uk-quick.json'

// All available dictionaries. Adding a new one: create a JSON word list,
// import it here, and add an entry to the array.
export const DICTIONARIES: Dictionary[] = [
  {
    id: 'en-quick',
    language: 'en',
    title: 'Quick Game',
    difficulty: 'medium',
    examples: ['apple', 'bicycle', 'ocean', 'guitar'],
    words: enQuickWords,
  },
  {
    id: 'uk-quick',
    language: 'uk',
    title: 'Швидка гра',
    difficulty: 'medium',
    examples: ['яблуко', 'велосипед', 'океан', 'гітара'],
    words: ukQuickWords,
  },
]

export function getDictionariesByLanguage(language: string): Dictionary[] {
  return DICTIONARIES.filter((d) => d.language === language)
}

export function getDictionaryById(id: string): Dictionary | undefined {
  return DICTIONARIES.find((d) => d.id === id)
}
