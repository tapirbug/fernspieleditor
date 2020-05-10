import {
  PUSH_SOUND,
  REPLACE_SOUND,
  SET_SOUND_REMOVED,
  SET_SOUND_REVIVED
} from '../../mutation-types'
import { SoundsModuleState } from './sounds-module-state'
import { Sound } from './sound'
import Vue from 'vue'

export const mutations = {
  [PUSH_SOUND]: pushSound,
  [REPLACE_SOUND]: replaceSound,
  [SET_SOUND_REMOVED]: setSoundRemoved(true),
  [SET_SOUND_REVIVED]: setSoundRemoved(false)
}

function pushSound (state: SoundsModuleState, sound: Sound): void {
  state.sounds.push(sound)
}

function replaceSound (state: SoundsModuleState, newSound: Sound) {
  const idx = state.sounds.findIndex(sound => sound.id === newSound.id)
  if (idx === -1) {
    throw new Error(`Sound could not be updated because it was not found: ${newSound.id}`)
  }
  Vue.set(state.sounds, idx, newSound)
}

function setSoundRemoved (removed: boolean): (SoundsModuleState, string) => void {
  return function forStateAndId (state: SoundsModuleState, id: string) {
    for (const existingSound of state.sounds) {
      if (existingSound.id === id) {
        existingSound.removed = removed
        return
      }
    }

    throw new Error(`Sound could not be ${removed ? 'removed' : 'revived'} because it was not found: ${id}`)
  }
}
