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
  const two = cardNumbers[1]
  assert.equal(two.name, 2)
  assert.equal(two.value, 2)
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

test('util.gameReducer works correctly', (assert) => {
  const initialState = {
    winner: '',
    deck: [
      { value: 10 },
      { value: 11 },
      { value: 10 },
      { value: 10 },
      { value: 10 },
      { value: 10 }
    ],
    playerHand: [],
    dealerHand: [],
    playerWins: 0,
    dealerWins: 0
  }
  var state = util.gameReducer(initialState, 'HIT_PLAYER')
  state = util.gameReducer(state, 'HIT_DEALER')
  state = util.gameReducer(state, 'HIT_PLAYER')
  state = util.gameReducer(state, 'HIT_DEALER')
  assert.deepEqual(state.deck.length, initialState.deck.length - 4)
  assert.deepEqual(state.playerHand, [{ value: 10 }, { value: 10 }])
  assert.deepEqual(state.dealerHand, [{ value: 11 }, { value: 10 }])

  const loseState = util.gameReducer(state, 'HIT_PLAYER')
  assert.deepEqual(loseState.winner, 'Dealer')
  assert.deepEqual(loseState.dealerWins, 1)

  var loseState2 = util.gameReducer(state, 'STICK')
  assert.deepEqual(loseState2.winner, 'Dealer')
  assert.deepEqual(loseState2.dealerWins, 1)
  loseState2 = util.gameReducer(loseState2, 'STICK')
  assert.deepEqual(loseState2.dealerWins, 1)

  var dumbDealerState = util.gameReducer(state, 'HIT_DEALER')
  dumbDealerState = util.gameReducer(dumbDealerState, 'HIT_DEALER')
  assert.deepEqual(dumbDealerState.winner, 'Player')
  assert.deepEqual(dumbDealerState.playerWins, 1)

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

test('util.prettyPrintHand pretty prints a hand', (assert) => {
  const hand = [
    { name: 'Ace', suite: '♠' },
    { name: 'King', suite: '♥' },
    { name: 2, suite: '♦' }
  ]
  assert.equal(util.prettyPrintHand(hand), '[ Ace ♠, King ♥, 2 ♦ ]')
  assert.end()
})
