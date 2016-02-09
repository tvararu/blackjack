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
