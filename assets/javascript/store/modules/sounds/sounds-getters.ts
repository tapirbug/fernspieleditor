import { Sound } from './sound'
import { SoundsModuleState } from './sounds-module-state'
import { PhonebookSubsetForSounds } from './sounds-phonebook-subset'
import { serializeSounds } from './sounds-serialize'

export interface SoundsGetters {
  findSound(id: string): Sound|null
  readonly sounds: readonly Sound[]
  hasFile(id: string): boolean
  isEmbedded(id: string): boolean
}

export const soundsGetterMappings = [
  'findSound',
  'sounds',
  'hasFile',
  'isEmbedded'
]

export const getters = {
  findSound,
  sounds,
  hasFile,
  isEmbedded
}

function findSound (state: SoundsModuleState): (string) => Sound|null {
  return function (id: string) {
    for (const sound of state.sounds) {
      if (sound.id === id) {
        return sound
      }
    }
    return null
  }
}

function sounds (state: SoundsModuleState): readonly Sound[] {
  return state.sounds.filter(sound => !sound.removed)
}

function hasFile (state: SoundsModuleState, getters: SoundsGetters): (string) => boolean {
  return function (id: string) {
    const sound = getters.findSound(id)
    if (sound === null) {
      return false
    }
    return sound.file !== ''
  }
}

function isEmbedded (state: SoundsModuleState, getters: SoundsGetters): (string) => boolean {
  return function (id: string) {
    const sound = getters.findSound(id)
    if (sound === null) {
      return false
    }
    if (typeof sound.file === 'string') {
      return sound.file.startsWith('data:')
    }
    return false // data object, not embedded
  }
}
