import { actions } from './serialize-actions'
import { getters } from './serialize-getters'
import { Module } from 'vuex'

/**
 * Initialize the `vuex` module for exporting phonebooks as YAML files.
 *
 * @returns {object} `vuex` module for YAML export
 */
export default function createSerializeModule (): Module<any, any> {
  return {
    actions,
    getters
  }
}
