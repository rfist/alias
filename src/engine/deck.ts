import type { DeckState } from '../types'

// Fisher-Yates shuffle — produces a uniformly random permutation.
// Returns a new array, does not mutate the input.
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Creates the initial deck state from a dictionary's word list (section 6.2).
export function createDeck(words: string[]): DeckState {
  return {
    shuffledWords: shuffleArray(words),
    currentIndex: 0,
    cycleCount: 0,
  }
}

// Draws the next word from the deck.
// If all words are exhausted, reshuffles and starts a new cycle (section 6.2).
// Returns the word and the updated deck state.
export function drawNextWord(deck: DeckState): { word: string; deck: DeckState } {
  if (deck.currentIndex < deck.shuffledWords.length) {
    const word = deck.shuffledWords[deck.currentIndex]
    return {
      word,
      deck: { ...deck, currentIndex: deck.currentIndex + 1 },
    }
  }

  // Deck exhausted — reshuffle and start next cycle
  const reshuffled = shuffleArray(deck.shuffledWords)
  return {
    word: reshuffled[0],
    deck: {
      shuffledWords: reshuffled,
      currentIndex: 1,
      cycleCount: deck.cycleCount + 1,
    },
  }
}
