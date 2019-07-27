import Vue from 'vue'
import defaultVueState from './fixtures/startup-phonebook.js'
import defaultSound from './fixtures/default-sound.js'
import uuid from '../util/random/uuid.js'
import { cleanIfPresent } from '../util/sanitize.js'
import {
  ADD_STATE,
  REMOVE_STATE,
  MOVE_STATE,
  FOCUS_STATE,
  CLEAR_PHONEBOOK,
  REPLACE_PHONEBOOK,
  MAKE_INITIAL_STATE,
  ADD_SOUND,
  UPDATE_SOUND
} from './mutation-types.js'
import getters from './getters.js'
import statesGetters from './modules/states/states-getters.js'
import { toStr, toBool, toFiniteFloat } from '../util/conv.js'

export default {
  [ADD_STATE] (vuexState, { id, position }) {
    vuexState.vendor.fernspieleditor = {
      ...vuexState.vendor.fernspieleditor,
      [id]: {
        network: { position }
      }
    }
  },
  [REMOVE_STATE] (vuexState, id) {
    // If deleted state was focused, remove selection
    if (vuexState.focusedStateId === id) {
      vuexState.focusedStateId = null
    }

    // If was initial, an initial state is now missing
    if (vuexState.initial === id) {
      vuexState.initial = null
    }

    // Remove network positions
    Vue.delete(vuexState.vendor.fernspieleditor, id)
  },
  [MOVE_STATE] (vuexState, { id, to }) {
    const network = getters.findNetwork(vuexState)(id)

    if (network) {
      network.position = to
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
  },
  [UPDATE_SOUND] (state, { id, ...updatedProps }) {
    const before = state.sounds[id] || defaultSound()
    state.sounds[id] = {
      ...before,
      ...sanitizeSound(updatedProps)
    }
  },
  [ADD_SOUND] (state, newSound) {
    const id = (typeof newSound.id !== 'string') ? uuid() : newSound.id
    newSound = {
      ...defaultSound(),
      ...sanitizeSound(newSound)
    }
    Vue.set(state.sounds, id, newSound)
  }
}

function sanitizeSound (sound) {
  const sanitized = { ...sound }

  cleanIfPresent(sanitized, 'name', toStr)
  cleanIfPresent(sanitized, 'loop', toBool)
  cleanIfPresent(sanitized, 'speech', toStr)
  cleanIfPresent(sanitized, 'volume', toFiniteFloat)
  cleanIfPresent(sanitized, 'backoff', toFiniteFloat)

  return sanitized
}
