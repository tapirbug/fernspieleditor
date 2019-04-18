export default {
  /// Name of the currently focused state or null if nothing selected.
  focusedStateId: null,
  states: [
    {
      id: 1,
      name: "ring",
      network: {
        position: {
          x: 0,
          y: 10
        }
      }
    },
    {
      id: 10,
      name: "countdown",
      network: {
        position: {
          x: 500,
          y: 10
        }
      }
    }
  ]
}
