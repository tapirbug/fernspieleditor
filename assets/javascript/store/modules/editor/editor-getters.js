export default {
  findNetwork,
  focusedState,
  hasFocusedState,
  isFocused,
  focusedStateId: editor => editor.focusedStateId
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
    if (typeof editor.extensionProperties.states[id] !== 'undefined') {
      return editor.extensionProperties.states[id].network
    } else {
      return undefined
    }
  }
}

function focusedState (editor, _getters, _rootState, rootGetters) {
  return rootGetters.findState(editor.focusedStateId)
}

function hasFocusedState (editor) {
  return !!editor.focusedStateId
}

function isFocused (editor) {
  return function (id) {
    return id === editor.focusedStateId
  }
}
