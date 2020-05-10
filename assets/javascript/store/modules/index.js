import deserialize from './deserialize/index'
import info from './info/index.js'
import remote from './remote/index.js'
import serialize from './serialize/index'
import sounds from './sounds/index.js'
import states from './states/index'
import transitions from './transitions/index'
import undo from './undo/index'

/**
 * Initialize the `vuex` modules to be used in the store.
 *
 * Modules:
 * * `store.initial` (Manages the initial state ID)
 * * `store.states` (State machine states and their inherent properties).
 * * `store.transitions` (Transitions between states)
 * * `store.sounds` (Speech and sound files)
 *
 * And these stateless modules:
 * * `serialize`
 * * `deserialize`
 *
 * @param {object} phonebook Initial root state, in phonebook format, to initialize the submodules with initial data
 * @returns {object} `vuex` module for states
 */
export default function createModules (phonebook) {
  return {
    info: info(phonebook.info || {}),
    deserialize: deserialize(),
    states: states(phonebook || {}),
    transitions: transitions(phonebook.transitions || {}),
    sounds: sounds(phonebook.sounds || {}),
    serialize: serialize(),
    remote: remote(),
    undo: undo()
  }
}
