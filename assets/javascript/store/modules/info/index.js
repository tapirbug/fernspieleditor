import getters from './info-getters.js'
import mutations from './info-mutations.js'

/**
 * Initialize the `vuex` module that manages metadata about the phonebook,
 * such as its name and description.
 *
 * It takes initial state as a parameter.
 *
 * The module is expected to be mounted at `store.info`.
 *
 * @param {object} info initial state
 * @returns {object} `vuex` module for phonebook metadata
 */
export default function createInfoModule (info) {
  return {
    state: info,
    getters,
    mutations
  }
}
