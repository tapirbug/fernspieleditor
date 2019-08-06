import {
  REMOVE_STATE,
  MAKE_INITIAL_STATE,
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'

export default {
  [REMOVE_STATE] (initialState, id) {
    // If was initial, an initial state is now missing
    if (initialState === id) {
      initialState.initial = null
    }
  },
  [MAKE_INITIAL_STATE] (initialState, id) {
    initialState.initial = id
  },
  [REPLACE_PHONEBOOK] (initialState, phonebook) {
    initialState.initial = phonebook.initial || null
  }
}
