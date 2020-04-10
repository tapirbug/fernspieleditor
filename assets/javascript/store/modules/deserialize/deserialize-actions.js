import {
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'
import {
  LOAD_FILE
} from '../../action-types.js'
import defaultState from '../../fixtures/default-state.js'
import YAML from 'yaml'
import { mapValues } from '../../../util/map-obj.js'
import uuid from '../../../util/random/uuid.js'
import defaultSound from '../../fixtures/default-sound.js'

export default {
  [LOAD_FILE] ({ commit }, { files }) {
    return getSingleFile(files)
      .then(validateFilename)
      .then(loadFile)
      .then(YAML.parse)
      .then(upgradeLegacyPhonebooks)
      .then(ensureExpectedPropertiesPresent)
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
     * Ensure the root properties `states`, `transitions`,
     * `sounds`, and `vendor` are present.
     *
     * If `vendor` is missing, the nested properties are
     * also auto-generated.
     *
     * Other, unknown properties are preserved.
     */
    function ensureExpectedPropertiesPresent (newState) {
      const present = {
        ...newState,
        states: newState.states || {},
        transitions: newState.transitions || {},
        sounds: newState.sounds || {},
        vendor: newState.vendor || {}
      }

      if (!present.vendor.fernspieleditor) {
        present.vendor.fernspieleditor = {
          version: 1
        }
      }

      if (!present.vendor.fernspieleditor.extensionProperties) {
        present.vendor.fernspieleditor.extensionProperties = {}
      }

      if (!present.vendor.fernspieleditor.extensionProperties.states) {
        present.vendor.fernspieleditor.extensionProperties.states = {}
      }

      return present
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

    function upgradeLegacyPhonebooks (newState) {
      if (newState && newState.vendor && newState.vendor.fernspieleditor && typeof newState.vendor.fernspieleditor.version === 'undefined') {
        console.warn('upgrading legacy phonebook')

        // old phonebooks only stored state extension properties and kept them at the root object,
        // move it
        newState.vendor.fernspieleditor = {
          version: 1,
          extensionProperties: {
            states: { ...newState.vendor.fernspieleditor }
          }
        }

        if (!newState.sounds) {
          newState.sounds = {}
        }

        // state-based sounds cannot be edited anymore, make them into a proper sound
        if (newState && newState.states) {
          for (let [, state] of Object.entries(newState.states)) {
            if (!state.sounds) {
              state.sounds = []
            }

            if (state.id) {
              // no duplicated ID property in new phonebooks
              delete state.id
            }

            if (state.speech) {
              const speech = state.speech
              delete state.speech
              const soundId = uuid()
              state.sounds.push(soundId)
              newState.sounds[soundId] = {
                ...defaultSound(),
                speech
              }
            }
          }
        }
      }

      return newState
    }

    function autoLayout (newState) {
      const stateExt = newState.vendor.fernspieleditor.extensionProperties.states

      let posX = 0
      let posY = 0
      Object.keys(newState.states)
        .concat('any')
        .forEach(id => {
          if (!stateExt[id]) {
            stateExt[id] = {
              network: {
                position: { x: (posX += 150), y: (posY += 50) }
              }
            }
          }
        })

      return newState
    }

    function autoSelect (newState) {
      const focusPresent = newState &&
          newState.vendor &&
          newState.vendor.fernspieleditor &&
          newState.vendor.fernspieleditor.focusedStateId

      if (focusPresent) {
        return newState
      }

      const focusedStateId = Object.entries(newState.states)[0] ||
          // if has no states, select any, which is always present
          'any'

      return {
        ...newState,
        vendor: {
          ...(newState.vendor || {}),
          fernspieleditor: {
            ...(newState.vendor.fernspieleditor || {}),
            focusedStateId
          }
        }
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
      commit(REPLACE_PHONEBOOK, newPhonebook, { root: true })
      return `Loading OK`
    }
  }
}
