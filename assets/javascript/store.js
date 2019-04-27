import Vue from 'vue'
import Vuex from 'vuex'
import defaultState from './default-state.js'
import uuid from './uuid.js'
import { ADD_STATE, MOVE_STATE, UPDATE_STATE, REMOVE_STATE, FOCUS_STATE, ADD_TRANSITION, REMOVE_TRANSITION } from './mutation-types.js'
import { CONTINUE_UPDATE_STATE, SAVE_AS } from './action-types.js'
import createLogger from 'vuex/dist/logger'
import YAML from 'json-to-pretty-yaml'

Vue.use(Vuex)

const describeTransition = {
  timeout: ({ to, after }) => [ {
    type: 'timeout',
    when: `Timeout (${after}s)`,
    to
  } ],
  dial: (transitions) => Object.keys(transitions)
    .sort()
    .map(num => {
      return {
        type: 'dial',
        num,
        when: `Dial ${num}`,
        to: transitions[num]
      }
    }),
  pick_up: (to) => {
    return [ {
      type: 'pick_up',
      when: 'Pick up',
      to
    } ]
  },
  hang_up: (to) => {
    return [ {
      type: 'hang_up',
      when: 'Hang up',
      to
    } ]
  }
}

const getters = {
  findState: state => id =>
    state.states[id],
  stateNamed: state => name =>
    Object.values(state.states).find(state => state.name === name),
  focusedState: (state) =>
    getters.findState(state)(state.focusedStateId),
  focusedStateName (state) {
    const focused = getters.focusedState(state)
    return focused ? focused.name : undefined
  },
  isFocused: vuexState => ({ id }) =>
    id === vuexState.focusedStateId,
  transitionSummariesFrom: (state) => ({ id }) =>
    Object.keys(state.transitions[id])
      .sort()
      .map(type => {
        if (!describeTransition[type] || !state.transitions[id][type]) {
          return []
        }
        return describeTransition[type](
          state.transitions[id][type]
        ).map(desc => {
          return {
            ...desc,
            from: id,
            fromName: getters.findState(state)(id).name,
            toName: getters.findState(state)(desc.to).name
          }
        })
      })
      .reduce((a, b) => a.concat(b), []),
  transitionSummariesTo: (state) => ({ id }) =>
      Object.keys(state.transitions)
        .filter(idOrOther => idOrOther !== id)
        .map(id => getters.transitionSummariesFrom(state)({ id }))
        .reduce((a, b) => a.concat(b), [])
        .filter(summary => summary.to === id),
  phonebookYaml: ({ states, transitions }) => {
    return YAML.stringify({
      states: Object.values(states)
        .reduce(
          (acc, {id, ...state}) => {
            acc[JSON.parse(JSON.stringify(id))] = JSON.parse(JSON.stringify(state)) // deep copies
            return acc
          },
          {}
        ), // core phonebook format does not duplicate id, remove them
      transitions: JSON.parse(JSON.stringify(transitions))
    })
  }
}

let renamingTimeout = false

const actions = {
  [CONTINUE_UPDATE_STATE] ({ commit }, payload) {
    if (renamingTimeout) {
      window.clearTimeout(renamingTimeout)
    }

    renamingTimeout = window.setTimeout(
      () => commit(UPDATE_STATE, payload),
      100
    )
  },
}

const mutations = {
  [ADD_STATE] (vuexState, newState) {
    const id = uuid()
    vuexState.states = {
      ...vuexState.states,
      [id]: {
        ...Object.values(defaultState.states)[0],
        id,
        ...newState
      }
    }
    vuexState.transitions = {
      ...vuexState.transitions,
      [id]: {}
    }
  },
  [UPDATE_STATE] (vuexState, payload) {
    const state = getters.findState(vuexState)(payload.id)

    if (state) {
      delete payload.id
      Object.assign(
        state,
        payload
      )
    }
  },
  [REMOVE_STATE] (vuexState, id) {
    const state = getters.findState(vuexState)(id)

    if (state) {
      // Delete transitions originating from deleted
      Vue.delete(vuexState.transitions, id)
      // And transitions from other states to the deleted too
      getters.transitionSummariesTo(vuexState)({ id })
        .forEach(summary => removeTransition(vuexState, summary))

      if (vuexState.focusedStateId === id) {
        vuexState.focusedStateId = null
      }

      // Finally, delete the state itself
      Vue.delete(vuexState.states, id)
    }
  },
  [MOVE_STATE] (vuexState, { id, to }) {
    const state = getters.findState(vuexState)(id)

    if (state) {
      state.network.position = to
    }
  },
  [FOCUS_STATE] (vuexState, id) {
    vuexState.focusedStateId =
      (getters.findState(vuexState)(id))
        ? id
        : null
  },
  [ADD_TRANSITION] (vuexState, { transitionType, from, ...config }) {
    const existingTransitions = vuexState.transitions
    const isObj = transitionType !== 'hang_up' && transitionType !== 'pick_up'
    const updatedTransitions = {
      [from]: {
        ...existingTransitions[from],
        [transitionType]: isObj
          ? {
            ...existingTransitions[from][transitionType],
            ...config
          }
          : config.to
      }
    }
    vuexState.transitions = {
      ...existingTransitions,
      ...updatedTransitions
    }
  },
  [REMOVE_TRANSITION]: removeTransition
}

function removeTransition (vuexState, summary) {
  if (summary.type === 'dial') {
    Vue.delete(vuexState.transitions[summary.from].dial, summary.num)
  } else {
    // timeout, pick up, hang up and others, remove the whole thing
    Vue.delete(vuexState.transitions[summary.from], summary.type)
  }
}

const store = new Vuex.Store({
  plugins: [createLogger()],
  state: { ...defaultState },
  mutations,
  getters,
  actions
})

export default store
