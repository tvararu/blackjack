(() => {
  'use strict'
  class Blackjack {}

  if (typeof module !== 'undefined') {
    module.exports = Blackjack
  } else if (typeof window !== 'undefined') {
    window.Blackjack = Blackjack
  }
})()
