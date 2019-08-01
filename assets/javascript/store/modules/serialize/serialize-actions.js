import YAML from 'yaml'
import { toDataURL } from '../../../util/file/read.js'
import { TO_YAML } from '../../action-types.js'

export default {
  [TO_YAML]: ({ getters, rootState }) => {
    if (!getters.canSave) {
      return Promise.reject(new Error('File is inconsistent and cannot be saved'))
    }

    const { initial, states, transitions, vendor, sounds } = rootState
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
  }
}