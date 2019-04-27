export default {
  /// Name of the currently focused state or null if nothing selected.
  focusedStateId: null,
  initial: 'afe30063-b562-4681-80c6-a784cea5af5c',
  states: {
    'afe30063-b562-4681-80c6-a784cea5af5c': {
      id: 'afe30063-b562-4681-80c6-a784cea5af5c',
      name: 'ring',
      description: '',
      speech: '',
      ring: 0.5,
      terminal: false,
    },
  },
  transitions: {
    'afe30063-b562-4681-80c6-a784cea5af5c': {
      timeout: {
        after: 1.5,
        to: 'afe30063-b562-4681-80c6-a784cea5af5c'
      }
    }
  },
  vendor: {
    // Fernspieleditor additions to the core format
    fernspieleditor: {
      'afe30063-b562-4681-80c6-a784cea5af5c': {
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
