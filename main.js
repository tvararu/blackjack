(() => {
  'use strict'

  const util = {
    getSuites () {
      return ['♠', '♥', '♦', '♣']
    },

    getCardNumbers () {
      const twoToTen = (Array.from(new Array(9), x => x + 2))
      return [
        { name: 'Ace', value: 11 },
        ...(twoToTen.map(n => ({ name: n, value: n }))),
        { name: 'Jack', value: 10 },
        { name: 'Queen', value: 10 },
        { name: 'King', value: 10 }
      ]
    },

    getDeck (suites, cardNumbers) {
      return suites.reduce((acc, suite) => {
        const cardsOfSuite = cardNumbers.map(cn => ({
          name: cn.name,
          value: cn.value,
          suite
        }))
        return [...acc, ...cardsOfSuite]
      }, [])
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
