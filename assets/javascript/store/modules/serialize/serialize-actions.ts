import YAML from 'yaml'
import { TO_YAML, SERIALIZE, SERIALIZE_SOUNDS } from '../../action-types'
import { Phonebook } from '../../../phonebook/phonebook'
import { FernspieleditorExtVersion } from '../../../phonebook/phonebook-fernspieleditor-ext'
import { ActionContext } from 'vuex'
import { ModuleGetters } from '../module-getters.js'
import { PhonebookSubsetForSounds } from '../sounds/sounds-phonebook-subset'

export interface SerializeActions {
  toYaml(): Promise<string>
  serialize(): Promise<Phonebook>
}

export const actions = {
  [TO_YAML]: toYaml,
  [SERIALIZE]: serialize
}

export const serializeActionMapping = {
  toYaml: TO_YAML,
  serialize: SERIALIZE
}

interface SerializeContext extends ActionContext<any, any> {
  rootGetters: ModuleGetters
}

async function toYaml (ctx): Promise<string> {
  const phonebook = await serialize(ctx)
  return YAML.stringify(phonebook)
}

async function serialize ({ dispatch, getters, rootState, rootGetters }: SerializeContext): Promise<Phonebook> {
  if (!getters.canSave) {
    throw new Error('File is inconsistent and cannot be saved')
  }

  const phonebookSubsetForSounds = await dispatch(SERIALIZE_SOUNDS, null, { root: true }) as PhonebookSubsetForSounds
  const {
    phonebookSubsetForInfo,
    phonebookSubsetForStates
  } = rootGetters
  const phonebook: Phonebook = {
    info: { ...phonebookSubsetForInfo.info },
    sounds: { ...phonebookSubsetForSounds.sounds },
    initial: rootGetters.initial,
    states: { ...phonebookSubsetForStates.states },
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
}
