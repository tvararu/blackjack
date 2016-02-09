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
