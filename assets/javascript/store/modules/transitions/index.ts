import getters from './transitions-getters'
import mutations from './transitions-mutations'
import { deserialize } from './transitions-deserialize'
import { PhonebookTransitions } from '../../../phonebook/phonebook-transitions'

/**
 * Initialize the transitions `vuex` module with the given initial data.
 *
 * @param transitions Initial transitions
 * @returns `vuex` module for transitions
 */
export default function createTransitionsModule (transitions: PhonebookTransitions): object {
  return {
    state: {
      transitions: deserialize(transitions)
    },
    getters,
    mutations
  }
}
