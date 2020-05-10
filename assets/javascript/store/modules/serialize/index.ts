import { actions } from './serialize-actions'
import { getters } from './serialize-getters'

/**
 * Initialize the `vuex` module for exporting phonebooks as YAML files.
 *
 * @returns {object} `vuex` module for YAML export
 */
export default function createSerializeModule () {
  return {
    actions,
    getters
  }
}
