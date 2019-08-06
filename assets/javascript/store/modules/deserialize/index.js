import actions from './deserialize-actions.js'

/**
 * Initialize the `vuex` module for loading phonebooks.
 *
 * @returns {object} `vuex` module for YAML import
 */
export default function createDeserializeModule () {
  return {
    state: {},
    actions
  }
}
