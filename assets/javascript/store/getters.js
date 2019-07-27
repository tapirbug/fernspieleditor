import YAML from 'yaml'
import { toDataURL } from '../util/file/read.js'

export default {
  phonebookYamlBlockers: ({ initial }) => {
    const blockers = []

    if (!initial) {
      blockers.push('Some state must be marked as the initial state')
    }

    return blockers
  },
  phonebookYaml: (vuexState, getters) => {
    if (getters.phonebookYamlBlockers.length > 0) {
      return
    }

    const { initial, states, transitions, vendor, sounds } = vuexState
    return inlineFiles(sounds)
      .then(inlinedSounds =>
        YAML.stringify({
          initial,
          states,
          transitions,
          vendor,
          sounds: inlinedSounds
        })
      )

    /**
     * Converts contained file handles to data URIs, embedding
     * them in the phonebook.
     */
    function inlineFiles (sounds) {
      const soundIdsToInline = Object.keys(sounds)
        .filter(soundId => typeof sounds[soundId].file === 'object')

      return inlineNext({ ...sounds }, soundIdsToInline)

      function inlineNext (sounds, idsToInline) {
        if (idsToInline.length === 0) {
          return Promise.resolve(sounds)
        }

        const id = idsToInline.pop()
        return inlineFile(sounds[id]).then(sound => {
          sounds[id] = sound
          return inlineNext(sounds, idsToInline)
        })
      }

      function inlineFile (sound) {
        if (typeof sound.file !== 'object') {
          return Promise.resolve(sound)
        }

        if (!FileReader) {
          return Promise.reject(new Error('Your browser does not allow for file reading. Maybe upgrading your browser helps?'))
        }

        return toDataURL(sound.file).then(uri => {
          return {
            ...sound,
            file: uri
          }
        })
      }
    }
  },
  /// Finds network properties of state with ID
  findNetwork: ({ vendor }) => id => {
    if (typeof vendor.fernspieleditor[id] === 'undefined') {
      return
    }

    return vendor.fernspieleditor[id].network
  }
}
