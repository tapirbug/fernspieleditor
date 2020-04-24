import {
  ADD_STATE,
  UPDATE_STATE,
  REMOVE_STATE,
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'
import { toStr, toFiniteFloat, toBool } from '../../../util/conv.js'
import { cleanIfPresent } from '../../../util/sanitize.js'
import getters from './states-getters.js'
import Vue from 'vue'
import defaultState from '../../fixtures/default-state.js'

export default {
  [ADD_STATE] (states, { id, state: newState }) {
    Vue.set(
      states,
      id,
      {
        ...defaultState(),
        id,
        ...sanitizeState(newState)
      }
    )
  },
  [UPDATE_STATE] (vuexState, { id, change }) {
    const state = getters.findState(vuexState)(id)

    if (state) {
      Object.assign(
        state,
        sanitizeState(change)
      )
    }
  },
  [REMOVE_STATE] (states, id) {
    Vue.delete(states, id)
  },
  [REPLACE_PHONEBOOK] (states, phonebook) {
    // clear existing states
    Object.keys(states)
      .forEach(key => Vue.delete(states, key))

    // and set the new ones
    if (typeof phonebook === 'object' && typeof phonebook.states === 'object') {
      Object.entries(phonebook.states)
        .forEach(([id, state]) => Vue.set(states, id, state))
    }
  }
}

/**
 * Returns a version of the given complete or partial state
 * object with its properties sanitized and of the correct
 * type.
 *
 * The returned object can then be used for updating or
 * creating of states.
 *
 * The original state is not modified.
 *
 * @param state potentially tainted state
 * @returns sanitized state
 */
function sanitizeState (state) {
  const sanitized = {
    // keep unknown properties
    ...state
  }

  // and sanitize known ones
  cleanIfPresent(sanitized, 'name', toStr)
  cleanIfPresent(sanitized, 'description', toStr)
  cleanIfPresent(sanitized, 'ring', toFiniteFloat)
  cleanIfPresent(sanitized, 'terminal', toBool)

  return sanitized
}
