import Vue from 'vue'
import {
  ADD_STATE,
  REMOVE_STATE,
  MOVE_STATE,
  FOCUS_STATE,
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'

export default {
  [ADD_STATE] (editor, { id, position }) {
    Vue.set(
      editor.extensionProperties.states,
      id,
      {
        removed: false,
        network: { position }
      }
    )
  },
  [REMOVE_STATE] (editor, { id }) {
    const state = editor.extensionProperties.states[id]
    state.removed = !state.removed

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
  [REPLACE_PHONEBOOK] (editor, phonebook) {
    editor.extensionProperties = (phonebook && phonebook.vendor && phonebook.vendor.fernspieleditor && phonebook.vendor.fernspieleditor.extensionProperties)
      ? phonebook.vendor.fernspieleditor.extensionProperties
      : {}
  }
}
