export default {
  findNetwork
}

function findNetwork (editor) {

  /**
   * Finds the network properties (position, etc.) of the
   * state with the given ID.
   *
   * Returns `undefined` if no network properties are defined
   * for the state.
   *
   * @param {string} id ID of the state to get network for
   * @returns {any} network
   */
  return function (id) {
    if (typeof editor[id] === 'undefined') {
      return
    }

    return editor[id].network
  }
}
