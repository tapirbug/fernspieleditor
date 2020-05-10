import {
  PUSH_STATE,
  SET_STATE_REMOVED,
  SET_STATE_REVIVED,
  REPLACE_STATE,
  REPLACE_PHONEBOOK,
  FOCUS_STATE,
  MAKE_INITIAL_STATE
} from '../../mutation-types.js'
import { StatesModuleState } from './states-module-state'
import { createState, StateState } from './state'
import { Phonebook } from '../../../phonebook/phonebook'
import Vue from 'vue'

export const mutations = {
  [PUSH_STATE]: pushState,
  [SET_STATE_REMOVED]: setStateRemoved(true),
  [SET_STATE_REVIVED]: setStateRemoved(false),
  [REPLACE_STATE]: replaceState,
  [REPLACE_PHONEBOOK]: replacePhonebook,
  [FOCUS_STATE]: focusState,
  [MAKE_INITIAL_STATE]: makeInitialState
}

function pushState (moduleState: StatesModuleState, newState: StateState): void {
  moduleState.states.push(newState)
}

function setStateRemoved(removed: boolean): (StatesModuleState, string) => void {
  return function (moduleState: StatesModuleState, id: string) {
    for (const state of moduleState.states) {
      if (state.id === id) {
        state.removed = removed
        return
      }
    }
    throw new Error(`Could not ${removed ? 'remove' : 'revive'} state ${id} because it was not found`)
  }
}

function replaceState(moduleState: StatesModuleState, updated: StateState) {
  const updateIdx = moduleState.states.findIndex(eachState => eachState.id === updated.id)
  if (updateIdx === -1) {
    throw new Error(`ID ${updated.id} could not be updated because it was not found`)
  }

  Vue.set(moduleState.states, updateIdx, updated)
}

function replacePhonebook (moduleState: StatesModuleState, phonebook: Phonebook): void {
  // clear existing states
  moduleState.states = []
  moduleState.focusedStateId = null
  
  // and set the new ones
  if (typeof phonebook === 'object' && typeof phonebook.states === 'object') {
    moduleState.states = Object.entries(phonebook.states)
      .map(([id, phonebookState]) => createState({ id, ...phonebookState }))
  }
}

function focusState(moduleState: StatesModuleState, stateId: string) {
  moduleState.focusedStateId = stateId
}

function makeInitialState(moduleState: StatesModuleState, id: string) {
  moduleState.initial = id
}
