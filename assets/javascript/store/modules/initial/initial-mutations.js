import {
  REMOVE_STATE,
  MAKE_INITIAL_STATE,
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'

export default {
  [REMOVE_STATE] (initialState, { id, wasInitial }) {
    if (wasInitial) {
      if (initialState.initial === id) {
        // do
        initialState.initial = null
      } else {
        // undo
        initialState.initial = id
      }
    }
  },
  [MAKE_INITIAL_STATE] (initialState, { change: id }) {
    initialState.initial = id
  },
  [REPLACE_PHONEBOOK] (initialState, phonebook) {
    initialState.initial = phonebook.initial || null
  }
}
