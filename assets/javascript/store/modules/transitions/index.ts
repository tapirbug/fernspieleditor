import { actions } from './transitions-actions'
import { getters } from './transitions-getters'
import mutations from './transitions-mutations'
import { deserialize } from './transitions-deserialize'
import { PhonebookTransitions } from '../../../phonebook/phonebook-transitions'
import { TransitionModuleState } from './transitions-module-state'

/**
 * Initialize the transitions `vuex` module with the given initial data.
 *
 * @param transitions Initial transitions
 * @returns `vuex` module for transitions
 */
export default function createTransitionsModule (transitions: PhonebookTransitions): object {
  const state: TransitionModuleState = {
    transitions: deserialize(transitions)
  }
  return {
    actions,
    state,
    getters,
    mutations
  }
}
