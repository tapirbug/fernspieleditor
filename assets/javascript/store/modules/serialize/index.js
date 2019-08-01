import actions from './serialize-actions.js'
import getters from './serialize-getters.js'

/**
 * Initialize the `vuex` module for exporting phonebooks as YAML files.
 *
 * @returns {object} `vuex` module for YAML export
 */
export default function createSerializeModule() {
  return {
    state: {},
    actions,
    getters,
  }
}
