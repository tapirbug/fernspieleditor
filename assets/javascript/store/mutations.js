import Vue from 'vue'
import defaultVueState from './fixtures/startup-phonebook.js'
import {
  CLEAR_PHONEBOOK,
  REPLACE_PHONEBOOK,
} from './mutation-types.js'

export default {
  [CLEAR_PHONEBOOK] (vuexState) {
    Object.keys(defaultVueState())
      .forEach(prop => Vue.delete(vuexState, prop))
  },
  [REPLACE_PHONEBOOK] (vuexState, newPhonebook) {
    Object.entries(newPhonebook)
      .forEach(([key, val]) => Vue.set(vuexState, key, val))
  },
}
