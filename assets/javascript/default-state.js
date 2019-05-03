import uuid from './uuid.js'
const initialStateId = uuid()

export default {
  /// Name of the currently focused state or null if nothing selected.
  focusedStateId: null,
  initial: initialStateId,
  states: {
    [initialStateId]: {
      name: 'ring',
      description: '',
      speech: '',
      ring: 0.5,
      terminal: false,
    },
  },
  transitions: {
    [initialStateId]: {
      timeout: {
        after: 1.5,
        to: initialStateId
      }
    }
  },
  vendor: {
    // Fernspieleditor additions to the core format
    fernspieleditor: {
      [initialStateId]: {
        network: {
          position: {
            x: 200,
            y: 300
          }
        }
      }
    }
  }
}
