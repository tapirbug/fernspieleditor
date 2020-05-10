import YAML from 'yaml'
import { toDataURL } from '../../../util/file/read.js'
import { TO_YAML, SERIALIZE } from '../../action-types.js'
import { Phonebook } from '../../../phonebook/phonebook'
import { PhonebookSubsetForStates } from '../states/state.js'
import { FernspieleditorExtVersion } from '../../../phonebook/phonebook-fernspieleditor-ext'

export interface SerializeActions {
  toYaml(): Promise<string>
  serialize(): Promise<Phonebook>
}

export const actions = {
  [TO_YAML]: toYaml,
  [SERIALIZE]: serialize
}

async function toYaml(ctx): Promise<string> {
  const phonebook = await serialize(ctx)
  return YAML.stringify(phonebook)
}

async function serialize({ getters, rootState, rootGetters }): Promise<Phonebook> {
  if (!getters.canSave) {
    return Promise.reject(new Error('File is inconsistent and cannot be saved'))
  }

  const phonebookSubsetForStates: PhonebookSubsetForStates = rootGetters.phonebookSubsetForStates
  const phonebook : Phonebook = {
    info: rootState.info,
    sounds: await inlineFiles(rootState.sounds),
    initial: rootGetters.initial,
    states: {...phonebookSubsetForStates.states},
    transitions: rootGetters.transitions,
    vendor: {
      fernspieleditor: {
        version: FernspieleditorExtVersion.Version1,
        focusedStateId: phonebookSubsetForStates.vendor.fernspieleditor.focusedStateId,
        extensionProperties: {
          states: phonebookSubsetForStates.vendor.fernspieleditor.extensionProperties.states
        }
      }
    }
  }
  return phonebook

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
