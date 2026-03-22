import type { DictionaryLanguage } from './language'

export type DictionaryDifficulty = 'easy' | 'medium' | 'hard'

export interface Dictionary {
  id: string
  language: DictionaryLanguage
  title: string
  difficulty: DictionaryDifficulty
  examples: string[]  // short preview words shown in the dictionary picker
  words: string[]     // full word list, loaded from embedded asset
}
