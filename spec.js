const test = require('tape')
const Blackjack = require('./main')

const game = new Blackjack()

test('Blackjack instance exposes start method', (assert) => {
  assert.ok(game.start)
  assert.end()
})
