import uuid from './uuid.js'
import defaultSound from './default-sound.js'

export default function startupPhonebook() {
  const ringAgainLaterStateId = uuid()
  const ringingStateId = uuid()
  const speakingStateId = uuid()

  const greetingSoundId = uuid()

  return {
    /// Name of the currently focused state or null if nothing selected.
    focusedStateId: null,
    initial: ringingStateId,
    states: {
      any: {
        name: 'Any',
        description: 'Transitions from any are used when the current state has no transition defined for an event',
        speech: '',
        sounds: [],
        ring: 0.0,
        terminal: false
      },
      [ringAgainLaterStateId]: {
        name: 'Pause',
        description: 'Does nothing for a while and rings again afterwards',
        speech: '',
        sounds: [],
        ring: 0.0,
        terminal: false
      },
      [ringingStateId]: {
        name: 'Ring',
        description: '',
        speech: '',
        sounds: [],
        ring: 0.5,
        terminal: false
      },
      [speakingStateId]: {
        name: 'Introduce',
        description: '',
        speech: '',
        sounds: [ greetingSoundId ],
        ring: 0.0,
        terminal: false
      }
    },
    transitions: {
      any: {
        pick_up: speakingStateId,
        hang_up: ringAgainLaterStateId
      },
      [ringAgainLaterStateId]: {
        timeout: {
          after: 60.0,
          to: ringingStateId
        }
      },
      [ringingStateId]: {
        timeout: {
          after: 1.5,
          to: ringingStateId
        }
      },
      [speakingStateId]: {
        timeout: {
          after: 5.0,
          to: speakingStateId
        }
      }
    },
    sounds: {
      [greetingSoundId]: {
        ...defaultSound(),
        volume: 0.9,
        backoff: 0.2,
        loop: false,
        speech: `Hey there! This is ${randomName()} speaking.... You know, the ${randomAdjective()} ${randomJob()} from bowling. We often talked about ${randomTopic()} back in the eighties.`
      }
    },
    vendor: {
      // fernspieleditor additions to the core format
      fernspieleditor: {
        any: {
          network: {
            position: {
              x: 100,
              y: 100
            }
          }
        },
        [ringAgainLaterStateId]: {
          network: {
            position: {
              x: 300,
              y: 100
            }
          }
        },
        [ringingStateId]: {
          network: {
            position: {
              x: 500,
              y: 100
            }
          }
        },
        [speakingStateId]: {
          network: {
            position: {
              x: 500,
              y: 300
            }
          }
        }
      }
    }
  }
}

function randomName() {
  return randomElement([
    'John',
    'Jane',
    'Heinz Elbert',
    'Tatiana',
    'Columbo',
    'Rachel',
  ])
}

function randomAdjective() {
  return randomElement([
    'cunning',
    'drunk',
    'charming',
    'inquisitive',
    'questionable'
  ])
}

function randomJob() {
  return randomElement([
    'giraffe doctor',
    'whale researcher',
    'nuclear physicist',
    'investigative journalist',
  ])
}

function randomTopic() {
  return randomElement([
    'wrestling',
    'bird watching',
    '3D chess',
    'free jazz',
  ])
}

/**
 * Picks a random element from a non-empty array.
 * 
 * @param {Array} array pool to choose from
 */
function randomElement(array) {
  return array[(Math.random() * array.length)|0]
}