import uuid from './uuid.js'

const ringAgainLaterStateId = uuid()
const ringingStateId = uuid()
const speakingStateId = uuid()

export default {
  /// Name of the currently focused state or null if nothing selected.
  focusedStateId: null,
  initial: speakingStateId,
  states: {
    any: {
      name: 'Any',
      description: 'Transitions from any are used when the current state has no transition defined for an event',
      speech: '',
      ring: 0.0,
      terminal: false
    },
    [ringAgainLaterStateId]: {
      name: 'Pause',
      description: 'Does nothing for a while and rings again afterwards',
      speech: '',
      ring: 0.0,
      terminal: false
    },
    [ringingStateId]: {
      name: 'Ring',
      description: '',
      speech: '',
      ring: 0.5,
      terminal: false
    },
    [speakingStateId]: {
      name: 'Speak',
      description: '',
      speech: 'Who\'s there?',
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
    [speakingStateId]: {}
  },
  vendor: {
    // Fernspieleditor additions to the core format
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
