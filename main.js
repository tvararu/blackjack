(() => {
  'use strict'

  const util = {
    getSuites () {
      return ['♠', '♥', '♦', '♣']
    }
  }

  class Blackjack {
    constructor (options) {
      options = options || {}
    }

    start () {
      return this
    }
  }

  Blackjack.util = util

  if (typeof module !== 'undefined' && exports !== 'undefined') {
    module.exports = Blackjack
  } else if (typeof window !== 'undefined') {
    window.Blackjack = Blackjack
  }
})()
