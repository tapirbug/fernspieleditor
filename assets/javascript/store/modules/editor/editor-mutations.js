import Vue from 'vue'
import {
  ADD_STATE,
  REMOVE_STATE,
  MOVE_STATE,
} from '../../mutation-types.js'

export default {
  [ADD_STATE] (editor, { id, position }) {
    Vue.set(
      editor,
      id,
      {
        network: { position }
      }
    )
  },
  [REMOVE_STATE] (editor, id) {
    Vue.delete(editor, id)
  },
  [MOVE_STATE] (editor, { id, to }) {
    const network = editor[id].network

    if (network) {
      network.position = to
    }
  },
}
