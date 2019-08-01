import Vue from 'vue'
import defaultVueState from './fixtures/startup-phonebook.js'
import {
  REMOVE_STATE,
  FOCUS_STATE,
  CLEAR_PHONEBOOK,
  REPLACE_PHONEBOOK,
  MAKE_INITIAL_STATE,
} from './mutation-types.js'
import statesGetters from './modules/states/states-getters.js'

export default {
  [REMOVE_STATE] (vuexState, id) {
    // If deleted state was focused, remove selection
    if (vuexState.focusedStateId === id) {
      vuexState.focusedStateId = null
    }

    // If was initial, an initial state is now missing
    if (vuexState.initial === id) {
      vuexState.initial = null
    }
  },
  [FOCUS_STATE] (vuexState, id) {
    vuexState.focusedStateId =
      (statesGetters.findState(vuexState.states)(id))
        ? id
        : null
  },
  [CLEAR_PHONEBOOK] (vuexState) {
    Object.keys(defaultVueState())
      .forEach(prop => Vue.delete(vuexState, prop))
    vuexState.focusedStateId = null
  },
  [REPLACE_PHONEBOOK] (vuexState, newPhonebook) {
    Object.entries(newPhonebook)
      .forEach(([key, val]) => Vue.set(vuexState, key, val))
  },
  [MAKE_INITIAL_STATE] (vuexState, id) {
    vuexState.initial =
      (statesGetters.findState(vuexState.states)(id))
        ? id
        : null
  }
}
