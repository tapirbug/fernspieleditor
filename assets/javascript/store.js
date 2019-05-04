import Vue from 'vue'
import Vuex from 'vuex'
import defaultState from './default-state.js'
import uuid from './uuid.js'
import {
  CLEAR_PHONEBOOK,
  REPLACE_PHONEBOOK,
  MAKE_INITIAL_STATE,
  ADD_STATE,
  MOVE_STATE,
  UPDATE_STATE,
  REMOVE_STATE,
  FOCUS_STATE,
  ADD_TRANSITION,
  REMOVE_TRANSITION
} from './mutation-types.js'
import {
  CONTINUE_UPDATE_STATE,
  LOAD_FILE
} from './action-types.js'
import createLogger from 'vuex/dist/logger'
import YAML from 'yaml'

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
  },
  end: (to) => {
    return [ {
      type: 'end',
      when: 'Speech end',
      to
    } ]
  }
}

const getters = {
  findState: state => id =>
    state.states[id],
  isInitial: state => id =>
    state.initial === id,
  stateNamed: state => name =>
    Object.values(state.states).find(state => state.name === name),
  focusedState: (state) =>
    getters.findState(state)(state.focusedStateId),
  focusedStateName (state) {
    const focused = getters.focusedState(state)
    return focused ? focused.name : undefined
  },
  isFocused: vuexState => id =>
    id === vuexState.focusedStateId,
  transitionSummariesFrom: state => id =>
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
            fromName: getters.findState(state)(id) ? getters.findState(state)(id).name : 'undefined',
            toName: getters.findState(state)(desc.to) ? getters.findState(state)(desc.to).name : 'undefined'
          }
        })
      })
      .reduce((a, b) => a.concat(b), []),
  transitionSummariesTo: state => id =>
    Object.keys(state.transitions)
      .filter(idOrOther => idOrOther !== id)
      .map(id => getters.transitionSummariesFrom(state)(id))
      .reduce((a, b) => a.concat(b), [])
      .filter(summary => summary.to === id),
  phonebookYamlBlockers: ({ initial }) => {
    const blockers = []

    if (!initial) {
      blockers.push('Some state must be marked as the initial state')
    }

    return blockers
  },
  phonebookYaml: (vuexState) => {
    if (getters.phonebookYamlBlockers(vuexState).length > 0) {
      return
    }

    const { initial, states, transitions, vendor } = vuexState
    return YAML.stringify({
      initial,
      states,
      transitions,
      vendor
    })
  },
  /// Finds network properties of state with ID
  findNetwork: ({ vendor }) => id => {
    if (typeof vendor.fernspieleditor[id] === 'undefined') {
      return
    }

    return vendor.fernspieleditor[id].network
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
  [LOAD_FILE] ({ commit }, { files }) {
    return getSingleFile(files)
      .then(validateFilename)
      .then(loadFile)
      .then(YAML.parse)
      .then(autoName)
      .then(autoLayout)
      .then(autoSelect)
      .then(inlineAnyTransitions)
      .then(validateContents)
      .then(replaceState)

    function getSingleFile (files) {
      if (files.length < 1) {
        return Promise.reject(new Error('No file selected'))
      }

      if (files.length > 1) {
        return Promise.reject(new Error('Cannot select more than one file at a time.'))
      }

      return Promise.resolve(files[0])
    }

    function validateFilename (file) {
      const expectedPattern = /\.yaml$/i

      if (!expectedPattern.test(file.name)) {
        return Promise.reject(new Error('Phonebook files must end in .yaml'))
      }

      return file
    }

    function loadFile (file) {
      if (!FileReader) {
        return Promise.reject(new Error('Your browser does not support or allow loading of local files. Consider using Firefox.'))
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsText(file)
      })
    }

    function inlineAnyTransitions (newState) {
      if (!newState.transitions || !newState.transitions.any) {
        return newState
      }

      const any = newState.transitions.any
      delete newState.transitions.any
      newState.transitions = Object.entries(newState.transitions)
        .map(
          ([from, transitionsFrom]) => {
            let dial = any.dial
            if (!dial) {
              dial = transitionsFrom.dial
            } else if (transitionsFrom.dial) {
              // both defined, merge dial
              dial = {
                ...any.dial,
                ...transitionsFrom.dial
              }
            }

            return [
              from,
              {
                ...any,
                ...transitionsFrom, // For everything except dial, replace transitions from any
                dial
              }
            ]
          }
        )
        .reduce(
          (acc, [from, transitionsFrom]) => {
            acc[from] = transitionsFrom
            return acc
          },
          {}
        )

      return newState
    }

    function autoName (newState) {
      Object.entries(newState.states)
        .map(([id, state]) => {
          // Use ID as name if no name defined
          if (!state) {
            newState.states[id] = {
              name: id
            }
          } else if (typeof state.name === 'undefined') {
            state.name = id
          }
        })

      return newState
    }

    function autoLayout (newState) {
      if (!newState.vendor) {
        newState.vendor = {}
      }

      if (!newState.vendor.fernspieleditor) {
        newState.vendor.fernspieleditor = {}
      }

      let posX = 0
      let posY = 0
      Object.keys(newState.states)
        .forEach(id => {
          if (!newState.vendor.fernspieleditor[id]) {
            newState.vendor.fernspieleditor[id] = {
              network: {
                position: { x: (posX += 150), y: (posY += 50) }
              }
            }
          }
        })

      return newState
    }

    function autoSelect (newState) {
      if (newState.focusedStateId) {
        return newState
      }

      const anyState = Object.entries(newState.states)[0]
      const anyStateId = anyState ? anyState[0] : null
      return {
        focusedStateId: anyStateId,
        ...newState
      }
    }

    function validateContents (contents) {
      if (!contents.states || !contents.transitions) {
        return Promise.reject(new Error('Incompatible file format.'))
      }

      return contents
    }

    function replaceState (newPhonebook) {
      // commit(CLEAR_PHONEBOOK)
      commit(REPLACE_PHONEBOOK, newPhonebook)
      return `Loading OK`
    }
  }
}

const mutations = {
  [CLEAR_PHONEBOOK] (vuexState) {
    Object.keys(defaultState)
      .forEach(prop => Vue.delete(vuexState, prop))
    vuexState.focusedStateId = null
  },
  [REPLACE_PHONEBOOK] (vuexState, newPhonebook) {
    Object.entries(newPhonebook)
      .forEach(([key, val]) => Vue.set(vuexState, key, val))
  },
  [ADD_STATE] (vuexState, { state: newState, position }) {
    const id = uuid()
    vuexState.states = {
      ...vuexState.states,
      [id]: {
        ...initialStateProps(),
        id,
        ...newState
      }
    }
    vuexState.transitions = {
      ...vuexState.transitions,
      [id]: {}
    }
    vuexState.vendor.fernspieleditor = {
      ...vuexState.vendor.fernspieleditor,
      [id]: {
        network: { position }
      }
    }
  },
  [UPDATE_STATE] (vuexState, { id, ...payload }) {
    const state = getters.findState(vuexState)(id)

    if (state) {
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
      getters.transitionSummariesTo(vuexState)(id)
        .forEach(summary => removeTransition(vuexState, summary))

      if (vuexState.focusedStateId === id) {
        vuexState.focusedStateId = null
      }

      if (vuexState.initial === id) {
        vuexState.initial = null
      }

      // Remove network positions
      Vue.delete(vuexState.vendor.fernspieleditor, id)

      // Finally, delete the state itself
      Vue.delete(vuexState.states, id)
    }
  },
  [MOVE_STATE] (vuexState, { id, to }) {
    const network = getters.findNetwork(vuexState)(id)

    if (network) {
      network.position = to
    }
  },
  [FOCUS_STATE] (vuexState, id) {
    vuexState.focusedStateId =
      (getters.findState(vuexState)(id))
        ? id
        : null
  },
  [MAKE_INITIAL_STATE] (vuexState, id) {
    vuexState.initial =
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

function initialStateProps () {
  const initial = {
    ...Object.values(defaultState.states)[0]
  }
  delete initial.ring
  return initial
}
