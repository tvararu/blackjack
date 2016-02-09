const test = require('tape')
const Blackjack = require('./main')
const util = Blackjack.util

const game = new Blackjack()

test('Blackjack instance exposes start method', (assert) => {
  assert.ok(game.start)
  assert.end()
})

test('util.getSuites returns four suites', (assert) => {
  assert.equal(util.getSuites().length, 4)
  assert.end()
})

test('util.getCardNumbers return cards Ace to King', (assert) => {
  const cardNumbers = util.getCardNumbers()
  assert.equal(cardNumbers.length, 13)
  const ace = cardNumbers[0]
  assert.equal(ace.name, 'Ace')
  assert.equal(ace.value, 11)
  assert.end()
})

test('util.getDeck returns 52 cards', (assert) => {
  const cardNumbers = util.getCardNumbers()
  const suites = util.getSuites()
  const deck = util.getDeck(suites, cardNumbers)
  assert.equal(deck.length, 52)
  assert.end()
})

// This test will fail once in a blue moon.
test('util.shuffle shuffles', (assert) => {
  const deck = (Array.from(new Array(1000), (_, i) => i))
  const shuffledDeck = util.shuffle(deck)
  assert.notDeepEqual(deck, shuffledDeck)
  assert.end()
})

test('util.deckReducer works correctly', (assert) => {
  const state = {
    deck: [1, 2, 3],
    playerHand: [],
    dealerHand: []
  }
  const state1 = util.deckReducer(state, 'HIT_PLAYER')
  assert.deepEqual(state1.deck, [2, 3])
  assert.deepEqual(state1.playerHand, [1])
  assert.deepEqual(state1.dealerHand, [])
  const state2 = util.deckReducer(state1, 'HIT_DEALER')
  assert.deepEqual(state2.deck, [3])
  assert.deepEqual(state2.playerHand, [1])
  assert.deepEqual(state2.dealerHand, [2])
  assert.end()
})

test('util.countHand counts correctly', (assert) => {
  const hand1 = [
    { name: 'Ace', value: 11 },
    { name: 'Ace', value: 11 }
  ]
  assert.equal(util.countHand(hand1), 12)
  const hand2 = [
    { name: 'Ace', value: 11 },
    { name: 'King', value: 10 }
  ]
  assert.equal(util.countHand(hand2), 21)
  const hand3 = [
    { name: 'Ace', value: 11 },
    { name: 'King', value: 10 },
    { name: 2, value: 2 }
  ]
  assert.equal(util.countHand(hand3), 13)
  const hand4 = []
  assert.equal(util.countHand(hand4), 0)
  const hand5 = [
    { name: 'Ace', value: 11 },
    { name: 'Ace', value: 11 },
    { name: 'Ace', value: 11 },
    { name: 'Ace', value: 11 },
    { name: 'King', value: 10 },
    { name: 2, value: 2 }
  ]
  assert.equal(util.countHand(hand5), 16)
  assert.end()
})

test('util.templatize produces a working template function', (assert) => {
  const str = 'Hello, {{ thing }}!'
  const template = util.templatize(str)
  assert.equal(typeof template, 'function')
  assert.equal(template({ thing: 'world' }), 'Hello, world!')
  assert.end()
})
