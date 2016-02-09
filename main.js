(() => {
  'use strict'

  const util = {
    getSuites () {
      return ['♠', '♥', '♦', '♣']
    },

    getCardNumbers () {
      const twoToTen = (Array.from(new Array(9), (_, i) => i + 2))
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
    },

    // Fisher-Yates stolen from the internet.
    // NB: Returns new array rather than shuffling in-place.
    shuffle (arr) {
      const newArr = [...arr]
      let currentIndex = newArr.length

      while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        let temporaryValue = newArr[currentIndex]
        newArr[currentIndex] = newArr[randomIndex]
        newArr[randomIndex] = temporaryValue
      }

      return newArr
    },

    // (state, action) => (state)
    gameReducer (state, action) {
      switch (action) {
        case 'HIT_PLAYER':
          return {
            deck: state.deck.slice(1),
            playerHand: [...state.playerHand, ...state.deck.slice(0, 1)],
            dealerHand: state.dealerHand
          }
        case 'HIT_DEALER':
          return {
            deck: state.deck.slice(1),
            playerHand: state.playerHand,
            dealerHand: [...state.dealerHand, ...state.deck.slice(0, 1)]
          }
        default:
          return state
      }
    },

    countHand (hand) {
      const total = hand.reduce((acc, card) => acc + card.value, 0)
      const aces = hand.filter(card => card.value === 11)
      // For every Ace, if we're over 21, reduce the value by 10.
      const applyAceIfNecessary = (val) => (val > 21) ? val - 10 : val
      return aces.reduce(applyAceIfNecessary, total)
    },

    templatize (str) {
      return (options) => {
        return Object.keys(options).reduce((newStr, variable) => {
          const findUse = new RegExp(`\\\{\\\{\\\s*${variable}\\\s*\\\}\\\}`, 'g')
          return newStr.replace(findUse, options[variable].toString())
        }, str)
      }
    },

    prettyPrintHand (hand) {
      const handStr = hand.map(card => `${card.name} ${card.suite}`).join(', ')
      return `[ ${handStr} ]`
    }
  }

  class Blackjack {
    constructor (options) {
      options = options || {}
      if (options.template && options.domElement) {
        this.template = util.templatize(document.querySelector(options.template).innerHTML)
        this.domElement = document.querySelector(options.domElement)
        this.domElement.addEventListener('click', this.handleClick.bind(this))
      }
      const suites = util.getSuites()
      const cardNumbers = util.getCardNumbers()
      const deck = util.shuffle(util.getDeck(suites, cardNumbers))
      this.state = {
        deck,
        playerHand: [],
        dealerHand: []
      }
    }

    // Poor man's event delegation, rather messy.
    handleClick (evt) {
      const tar = evt.target
      const dataEvent = tar.dataset.event
      if (dataEvent) {
        const info = dataEvent.split(':')
        const type = info[0]
        if (type === 'click') {
          const action = info[1]
          this.triggerAction(action)
        }
      }
    }

    triggerAction (action) {
      this.state = util.gameReducer(this.state, action)
      this.render()
    }

    render () {
      this.domElement.innerHTML = this.template({
        dealerScore: util.countHand(this.state.dealerHand),
        playerScore: util.countHand(this.state.playerHand),
        dealerHand: util.prettyPrintHand(this.state.dealerHand),
        playerHand: util.prettyPrintHand(this.state.playerHand)
      })
    }

    start () {
      this.triggerAction('HIT_PLAYER')
      this.triggerAction('HIT_DEALER')
      this.triggerAction('HIT_PLAYER')
      this.triggerAction('HIT_DEALER')
    }
  }

  Blackjack.util = util

  if (typeof module !== 'undefined' && exports !== 'undefined') {
    module.exports = Blackjack
  } else if (typeof window !== 'undefined') {
    window.Blackjack = Blackjack
  }
})()
