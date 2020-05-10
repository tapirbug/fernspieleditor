import {
  ADD_SOUND,
  UPDATE_SOUND,
  REMOVE_SOUND,
  SERIALIZE_SOUNDS
} from '../../action-types'
import { ActionContext } from 'vuex'
import { SoundsModuleState } from './sounds-module-state'
import { SoundSpec } from './sound-spec'
import { Sound, createSound } from './sound'
import { defaultSound } from '../../../phonebook/phonebook-sound'
import performReversible from '../undo/undo-reversible'
import { PUSH_SOUND, SET_SOUND_REMOVED, SET_SOUND_REVIVED, REPLACE_SOUND } from '../../mutation-types'
import { SoundsGetters } from './sounds-getters'
import { PhonebookSubsetForSounds } from './sounds-phonebook-subset'
import { serializeSounds } from './sounds-serialize'

export interface SoundsActions {
  addSound(spec: SoundSpec): Promise<Sound>
  updateSound(spec: SoundSpec): void
  removeSound(soundId: string): void
  serializeSounds(): Promise<PhonebookSubsetForSounds>
}

interface SoundsContext extends ActionContext<SoundsModuleState, any> {
  getters: SoundsGetters
}

export const actions = {
  [ADD_SOUND]: addSound,
  [REMOVE_SOUND]: removeSound,
  [UPDATE_SOUND]: updateSound,
  [SERIALIZE_SOUNDS]: doSerializeSounds
}

function addSound({ commit }: SoundsContext, spec: SoundSpec): Sound {
  const sound : Sound = createSound({
    ...defaultSound(),
    ...spec
  })
  performReversible(
    commit,
    'Add sound',
    {
      mutation: PUSH_SOUND,
      payload: sound,
      undoMutation: SET_SOUND_REMOVED,
      undoPayload: sound.id,
      redoMutation: SET_SOUND_REVIVED,
      redoPayload: sound.id
    }
  )
  return sound
}

function removeSound({ commit }: SoundsContext, id: string): void {
  performReversible(
    commit,
    'Remove sound',
    {
      mutation: SET_SOUND_REMOVED,
      payload: id,
      undoMutation: SET_SOUND_REVIVED,
      undoPayload: id
    }
  )
}

function updateSound({ commit, getters }: SoundsContext, update: SoundSpec): void {
  if (!('id' in update)) {
    throw new Error('ID is mandatory, cannot update')
  }

  const oldSound = getters.findSound(update.id)
  if (oldSound === null) {
    throw new Error(`No sound with ID ${update.id}, cannot update`)
  }

  const updatedSound = { ...oldSound, ...update }
  performReversible(
    commit,
    'Change Sound',
    {
      mutation: REPLACE_SOUND,
      payload: updatedSound,
      undoPayload: oldSound,
      noCopy: true // skip cloning, it does not support files from file pickers
    }
  )
}

function doSerializeSounds ({ state }: SoundsContext): Promise<PhonebookSubsetForSounds> {
  return serializeSounds(state)
}

/*function sanitizeSound (sound) {
  const sanitized = {
    // Make sure props have expected types
    name: toStr(sound.name),
    loop: toBool(sound.loop),
    speech: toStr(sound.speech),
    volume: toFiniteFloat(sound.volume),
    backoff: toFiniteFloat(sound.backoff)
    // any additional properties from the parameter are left out
  }

  if (typeof sound.file === 'string' && sound.file !== '') {
    // A file can be cleared by setting it to the empty string,
    // only set non-empty paths and data-URIs
    sanitized.file = sound.file
  } else if (typeof sound.file === 'object' && sound.file !== null) {
    // File objects are fine too
    sanitized.file = sound.file
  }

  return sanitized
}
*/