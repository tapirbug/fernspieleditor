import {
  REPLACE_PHONEBOOK
} from './mutation-types.js'
import {
  LOAD_FILE
} from './action-types.js'
import YAML from 'yaml'
import { mapValues } from '../util/map-obj.js'
import defaultState from './fixtures/default-state.js'

export default {
  [LOAD_FILE] ({ commit }, { files }) {
    return getSingleFile(files)
      .then(validateFilename)
      .then(loadFile)
      .then(YAML.parse)
      .then(removeAnyProps)
      .then(autoName)
      .then(autoLayout)
      .then(autoSelect)
      .then(addMissingDefaultStateProps)
      .then(addMissingTransitionMaps)
      .then(validateContents)
      .then(replaceState)

    function getSingleFile (files) {
      if (files.length < 1) {
        return Promise.reject(new Error('No file selected'))
      }

      if (files.length > 1) {
        return Promise.reject(new Error('Cannot select more than one file at a time.'))
      }

      return Promise.resolve(files[0])
    }

    function validateFilename (file) {
      const expectedPattern = /\.yaml$/i

      if (!expectedPattern.test(file.name)) {
        return Promise.reject(new Error('Phonebook files must end in .yaml'))
      }

      return file
    }

    function loadFile (file) {
      if (!FileReader) {
        return Promise.reject(new Error('Your browser does not support or allow loading of local files. Consider using Firefox.'))
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsText(file)
      })
    }

    /**
     * If incoming phonebooks define properties on `any`,
     * remove the properties map.
     */
    function removeAnyProps (newState) {
      const withoutAny = {
        ...newState,
        states: { ...newState.states }
      }
      delete withoutAny.states.any
      return withoutAny
    }

    function autoName (newState) {
      // First the state properties
      Object.entries(newState.states)
        .forEach(([id, state]) => {
          if (!state) {
            newState.states[id] = {
              name: id
            }
          } else if (typeof state.name === 'undefined') {
            // Use ID as name if no name defined
            state.name = id
          }
        })

      // then the sounds
      Object.entries(newState.sounds)
        .forEach(([id, sound]) => {
          if (!sound) {
            newState.sounds[id] = {
              name: id
            }
          } else if (typeof sound.name === 'undefined') {
            // Use ID as name if no name defined
            sound.name = id
          }
        })

      return newState
    }

    function autoLayout (newState) {
      if (!newState.vendor) {
        newState.vendor = {}
      }

      if (!newState.vendor.fernspieleditor) {
        newState.vendor.fernspieleditor = {}
      }

      let posX = 0
      let posY = 0
      Object.keys(newState.states)
        .concat('any')
        .forEach(id => {
          if (!newState.vendor.fernspieleditor[id]) {
            newState.vendor.fernspieleditor[id] = {
              network: {
                position: { x: (posX += 150), y: (posY += 50) }
              }
            }
          }
        })

      return newState
    }

    function autoSelect (newState) {
      if (newState.focusedStateId) {
        return newState
      }

      return {
        focusedStateId: Object.entries(newState.states)[0] || 'any',
        ...newState
      }
    }

    function addMissingDefaultStateProps (newState) {
      return {
        ...newState,
        states: mapValues(
          newState.states,
          state => {
            return {
              ...defaultState(),
              ...state
            }
          }
        )
      }
    }

    function addMissingTransitionMaps (newState) {
      return {
        ...newState,
        transitions: Object.keys(newState.states)
          .concat('any')
          .map(id => [id, newState.transitions[id] || {}])
          .reduce(
            (acc, [key, transitions]) => {
              acc[key] = transitions
              return acc
            },
            {}
          )
      }
    }

    function validateContents (contents) {
      if (!contents.states || !contents.transitions) {
        return Promise.reject(new Error('Incompatible file format.'))
      }

      return contents
    }

    function replaceState (newPhonebook) {
      // commit(CLEAR_PHONEBOOK)
      commit(REPLACE_PHONEBOOK, newPhonebook)
      return `Loading OK`
    }
  }
}
