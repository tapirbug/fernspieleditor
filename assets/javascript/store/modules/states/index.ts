import { actions } from './states-actions'
import { getters } from './states-getters'
import { mutations } from './states-mutations'
import { deserialize } from './states-deserialize'
import { PhonebookSubsetForStates } from './state'



/**
 * Initialize the state `vuex` module with the given initial data.
 *
 * @param {object} states Initial map of states
 * @returns {object} `vuex` module for states
 */
export default function createStateModule (phonebook: PhonebookSubsetForStates): object {
  return {
    state: deserialize(phonebook),
    actions,
    getters,
    mutations
  }
}
