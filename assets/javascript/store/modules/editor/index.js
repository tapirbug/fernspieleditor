import actions from './editor-actions.js'
import getters from './editor-getters.js'
import mutations from './editor-mutations.js'

/**
 * Initialize the editor `vuex` module with the given initial data.
 *
 * The module is expected to be mounted at `store.vendor.fernspieleditor`,
 * though this is not enforced.
 *
 * @param {object} editor initial edit state, e.g. from `vendor.fernspieleditor` in a phonebook
 * @returns {object} `vuex` module for editor state
 */
export default function createEditorModule(editor) {
  return {
    state: editor,
    actions,
    getters,
    mutations
  }
}
