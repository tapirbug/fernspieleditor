import {
  ADD_TRANSITION,
  REMOVE_TRANSITION,
  ADD_STATE,
  REMOVE_STATE,
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'
import Vue from 'vue'
import getters from './transitions-getters.js'

export default {
  [ADD_TRANSITION]: addTransition,
  [REMOVE_TRANSITION]: removeTransition,
  [ADD_STATE] (transitions, { id }) {
    // Initially, the transition map for a new state is empty
    Vue.set(transitions, id, {})
  },
  [REMOVE_STATE] (transitions, stateId) {
    // Remove transitions originating from removed state
    Vue.delete(transitions, stateId)

    // And remove transitions with this state as a target
    const transitionEdgesTo = getters.transitionEdgesTo(
      transitions,
      // hack: fabricating a fake getters object with only one getter (the required one)
      { transitionEdgesFrom: getters.transitionEdgesFrom(transitions) }
    )
    transitionEdgesTo(stateId)
      .forEach(summary => removeTransition(transitions, summary))
  },
  [REPLACE_PHONEBOOK] (transitions, phonebook) {
    // clear existing transitions
    Object.keys(transitions)
      .forEach(key => Vue.delete(transitions, key))

    // and set the new ones
    if (typeof phonebook === 'object' && typeof phonebook.transitions === 'object') {
      Object.entries(phonebook.transitions)
        .forEach(([id, state]) => Vue.set(transitions, id, state))
    }
  }
}

function addTransition (existingTransitions, { transitionType, from, ...config }) {
  const isObj = transitionType !== 'hang_up' && transitionType !== 'pick_up'

  Vue.set(
    existingTransitions[from],
    transitionType,
    isObj
    // complex transition config, override object properties
      ? {
        ...existingTransitions[from][transitionType],
        ...config
      }
    // simple transition config, replace the target state and done
      : config.to
  )
}

function removeTransition (transitions, summary) {
  if (summary.type === 'dial') {
    // Input transition, delete only the deleted number
    Vue.delete(transitions[summary.from].dial, summary.num)
  } else {
    // timeout, pick up, hang up and others, remove the whole thing
    Vue.delete(transitions[summary.from], summary.type)
  }
}
