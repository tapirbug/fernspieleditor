import editor from './editor/index.js'
import serialize from './serialize/index.js'
import sounds from './sounds/index.js'
import states from './states/index.js'
import transitions from './transitions/index.js'

/**
 * Initialize the `vuex` modules to be used in the store.
 *
 * Modules:
 * * `store.states` (State machine states and their inherent properties).
 * * `store.transitions` (Transitions between states)
 * * `store.sounds` (Speech and sound files)
 * * `store.vendor.fernspieleditor` (Editor-specific data, e.g. state positions in the editor)
 * 
 * And these stateless modules:
 * * `serialize`
 *
 * @param {object} phonebook Initial root state, to initialize the submodules with initial data
 * @returns {object} `vuex` module for states
 */
export default function createModules (phonebook) {
  const editorState = (phonebook.vendor && phonebook.vendor.fernspieleditor)
    ? phonebook.vendor.fernspieleditor
    : {}

  return {
    states: states(phonebook.states || {}),
    transitions: transitions(phonebook.transitions || {}),
    sounds: sounds(phonebook.sounds || {}),
    vendor: {
      state: {},
      getters: {},
      actions: {},
      mutations: {},
      modules: {
        fernspieleditor: editor(editorState),
      },
    },
    serialize: serialize()
  }
}
