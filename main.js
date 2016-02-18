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
      let newHand, newState, playerScore, dealerScore
      switch (action) {
        case 'DEAL':
          const suites = util.getSuites()
          const cardNumbers = util.getCardNumbers()
          const deck = util.shuffle(util.getDeck(suites, cardNumbers))
          newState = {
            deck,
            playerHand: [],
            dealerHand: [],
            winner: '',
            playerWins: state.playerWins || 0,
            dealerWins: state.dealerWins || 0
          }
          newState = util.gameReducer(newState, 'HIT_PLAYER')
          newState = util.gameReducer(newState, 'HIT_DEALER')
          newState = util.gameReducer(newState, 'HIT_PLAYER')
          newState = util.gameReducer(newState, 'HIT_DEALER')
          return newState

        case 'RESET':
          return util.gameReducer({}, 'DEAL')

        case 'HIT_PLAYER':
          if (state.winner) { return state }
          newHand = [...state.playerHand, ...state.deck.slice(0, 1)]
          newState = Object.assign({}, state, {
            deck: state.deck.slice(1),
            playerHand: newHand,
            dealerHand: state.dealerHand
          })
          const playerIsBust = util.countHand(newHand) > 21
          if (playerIsBust) {
            return util.gameReducer(newState, 'DEALER_WINS')
          }
          return newState

        case 'HIT_DEALER':
          if (state.winner) { return state }
          newHand = [...state.dealerHand, ...state.deck.slice(0, 1)]
          newState = Object.assign({}, state, {
            deck: state.deck.slice(1),
            playerHand: state.playerHand,
            dealerHand: newHand
          })
          const dealerIsBust = util.countHand(newHand) > 21
          if (dealerIsBust) {
            return util.gameReducer(newState, 'PLAYER_WINS')
          }
          return newState

        case 'STICK':
          if (state.winner) { return state }
          playerScore = util.countHand(state.playerHand)
          dealerScore = util.countHand(state.dealerHand)
          newState = state
          while (playerScore <= 21 && dealerScore < playerScore) {
            newState = util.gameReducer(newState, 'HIT_DEALER')
            playerScore = util.countHand(newState.playerHand)
            dealerScore = util.countHand(newState.dealerHand)
            if (dealerScore > 21) {
              return newState
            }
          }
          return util.gameReducer(newState, 'DEALER_WINS')

        case 'PLAYER_WINS':
          return Object.assign({}, state, {
            winner: 'Player',
            playerWins: state.playerWins + 1
          })

        case 'DEALER_WINS':
          return Object.assign({}, state, {
            winner: 'Dealer',
            dealerWins: state.dealerWins + 1
          })

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

    prettyPrintHand (hand, hideCards) {
      const handStr = hand.map((card, idx) =>
        (hideCards && idx > 0) ? '???' : `${card.name} ${card.suite}`
      ).join(', ')
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
        window.addEventListener('keypress', (evt) => {
          const key = String.fromCharCode(evt.keyCode).toUpperCase()
          switch (key) {
            case 'H': this.triggerAction('HIT_PLAYER'); break
            case 'S': this.triggerAction('STICK'); break
            case 'D': this.triggerAction('DEAL'); break
            case 'R': this.triggerAction('RESET'); break
          }
        })
      }
      this.state = util.gameReducer({}, 'DEAL')
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

    start () {
      this.render()
    }

    render () {
      this.domElement.innerHTML = this.template({
        dealerScore: (this.state.winner === '')
          ? util.countHand(this.state.dealerHand.slice(0, 1)) + ' + ?'
          : util.countHand(this.state.dealerHand),
        playerScore: util.countHand(this.state.playerHand),
        dealerHand: (this.state.winner === '')
          ? util.prettyPrintHand(this.state.dealerHand, true)
          : util.prettyPrintHand(this.state.dealerHand),
        playerHand: util.prettyPrintHand(this.state.playerHand),
        verdict: (this.state.winner === '')
          ? ''
          : `${this.state.winner} wins!`,
        dealerWins: this.state.dealerWins,
        playerWins: this.state.playerWins
      })
    }
  }

  Blackjack.util = util

  if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    module.exports = Blackjack
  } else if (typeof window !== 'undefined') {
    window.Blackjack = Blackjack
  }
})()
