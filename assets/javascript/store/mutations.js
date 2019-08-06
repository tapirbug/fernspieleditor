import Vue from 'vue'
import defaultVueState from './fixtures/startup-phonebook.js'
import {
  REPLACE_PHONEBOOK,
} from './mutation-types.js'

export default {
  [REPLACE_PHONEBOOK] (vuexState, newPhonebook) {
    Object.entries(newPhonebook)
      .forEach(([key, val]) => Vue.set(vuexState, key, val))
  },
}
