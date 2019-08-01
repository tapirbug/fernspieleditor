import Vue from 'vue'
import {
  ADD_STATE,
  REMOVE_STATE,
  MOVE_STATE,
  FOCUS_STATE
} from '../../mutation-types.js'

export default {
  [ADD_STATE] (editor, { id, position }) {
    Vue.set(
      editor.extensionProperties.states,
      id,
      {
        network: { position }
      }
    )
  },
  [REMOVE_STATE] (editor, id) {
    Vue.delete(editor, id)

    // If deleted state was focused, remove selection
    if (editor.focusedStateId === id) {
      editor.focusedStateId = null
    }
  },
  [MOVE_STATE] (editor, { id, to }) {
    const network = editor.extensionProperties.states[id].network

    if (network) {
      network.position = to
    }
  },
  [FOCUS_STATE] (editor, id) {
    editor.focusedStateId = id || null
  },
}
