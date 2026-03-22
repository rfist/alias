import { createDeck, drawNextWord } from '../deck'

describe('createDeck', () => {
  it('contains all words from the input list', () => {
    const words = ['apple', 'banana', 'cherry']
    const deck = createDeck(words)
    expect(deck.shuffledWords).toHaveLength(3)
    expect([...deck.shuffledWords].sort()).toEqual([...words].sort())
  })

  it('starts at index 0 with cycle 0', () => {
    const deck = createDeck(['a', 'b'])
    expect(deck.currentIndex).toBe(0)
    expect(deck.cycleCount).toBe(0)
  })
})

describe('drawNextWord', () => {
  it('draws words sequentially and advances the index', () => {
    const deck = createDeck(['a', 'b', 'c'])
    // Override shuffled words to make test deterministic
    const fixedDeck = { ...deck, shuffledWords: ['x', 'y', 'z'], currentIndex: 0 }

    const first = drawNextWord(fixedDeck)
    expect(first.word).toBe('x')
    expect(first.deck.currentIndex).toBe(1)

    const second = drawNextWord(first.deck)
    expect(second.word).toBe('y')
    expect(second.deck.currentIndex).toBe(2)
  })

  it('reshuffles and increments cycleCount when deck is exhausted', () => {
    const exhaustedDeck = {
      shuffledWords: ['a', 'b', 'c'],
      currentIndex: 3, // past the end
      cycleCount: 0,
    }
    const result = drawNextWord(exhaustedDeck)
    expect(result.deck.cycleCount).toBe(1)
    expect(result.deck.currentIndex).toBe(1)
    expect(['a', 'b', 'c']).toContain(result.word)
  })

  it('does not mutate the original deck', () => {
    const deck = { shuffledWords: ['a', 'b'], currentIndex: 0, cycleCount: 0 }
    drawNextWord(deck)
    expect(deck.currentIndex).toBe(0)
  })
})
