import getters from './sound-getters.js'
import mutations from './sound-mutations.js'

/**
 * Initialize the `vuex` module for sounds with the given initial data.
 *
 * @param {object} sounds initial map of UUIDs against sound objects
 * @returns {object} `vuex` module for sounds
 */
export default function createSoundModule (sounds) {
  return {
    state: sounds,
    getters,
    mutations
  }
}
