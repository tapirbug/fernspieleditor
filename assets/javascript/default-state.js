export default {
  /// Name of the currently focused state or null if nothing selected.
  focusedStateId: null,
  states: {
    'afe30063-b562-4681-80c6-a784cea5af5c': {
      id: 'afe30063-b562-4681-80c6-a784cea5af5c',
      name: 'ring',
      description: '',
      speech: '',
      network: {
        position: {
          x: 200,
          y: 300
        }
      }
    },
  },
  transitions: {
    'afe30063-b562-4681-80c6-a784cea5af5c': {
      timeout: {
        after: 1.5,
        to: 'afe30063-b562-4681-80c6-a784cea5af5c'
      }
    }
  }
}
