import { StateState, createState, StateSummary, summarize, StateSummaryWithRemoved, PhonebookSubsetForStates } from './state'
import { StatesModuleState } from './states-module-state'
import { PhonebookStates } from 'assets/javascript/phonebook/phonebook-states'
import { serialize } from './states-serialize'

export interface StatesGetters {
  /**
   * All the states, even the removed ones and including the any state.
   */
  readonly allStates: StateSummaryWithRemoved[]
  /**
   * All states, including the any state, but excluding removed ones.
   */
  readonly states: StateSummary[]
  readonly stateIds: string[]
  findState(id: string): StateSummary|null
  isAny(id: string): boolean
  isRemoved(stateId: string): boolean
  readonly focusedState: StateSummary|null
  readonly hasFocusedState: boolean
  isFocused(stateId: string): boolean
  readonly focusedStateId: string|null
  readonly initial: string|null
  readonly hasInitial: boolean
  isInitial(id: string): boolean
  readonly phonebookSubsetForStates: PhonebookSubsetForStates
}

export const statesGetterMappings = [
  'allStates',
  'states',
  'stateIds',
  'findState',
  'isAny',
  'isRemoved',
  'focusedState',
  'hasFocusedState',
  'isFocused',
  'focusedStateId',
  'initial',
  'hasInitial',
  'isInitial',
  'phonebookSubsetForStates'
]

/**
 * Getters for the `states` module.
 */
export const getters = {
  allStates,
  states,
  stateIds,
  findState,
  isAny,
  isRemoved,
  focusedState,
  hasFocusedState,
  isFocused,
  focusedStateId,
  initial,
  hasInitial,
  isInitial,
  phonebookSubsetForStates
}

function stateStates (state: StatesModuleState): StateState[] {
  return state.states
}

function activeStateStates (state: StatesModuleState): StateState[] {
  return stateStates(state)
    .filter(s => !s.removed)
}

function allStates (state: StatesModuleState): StateSummaryWithRemoved[] {
  return stateStates(state)
    .map(stateState => {
      return {
        ...summarize(stateState),
        removed: stateState.removed
      }
    })
}

function states (state: StatesModuleState): StateSummary[] {
  return activeStateStates(state)
    .map(summarize)
}

function stateIds (state: StatesModuleState) {
  return activeStateStates(state)
    .map(s => s.id)
}

function findState (state: StatesModuleState): (string) => StateSummary|null {
  return function (id: string): StateSummary|null {
    const matching = stateStates(state)
      .filter(s => s.id === id)

    if (matching.length === 0) {
      return null
    } else {
      return matching[0]
    }
  }
}

function isAny (): (string) => boolean {
  return id => id === 'any'
}

function isRemoved (moduleState: StatesModuleState): (string) => boolean {
  return function (stateId): boolean {
    for (const state of moduleState.states) {
      if (state.id === stateId) {
        return state.removed
      }
    }
    return false
  }
}

function focusedState (moduleState: StatesModuleState, getters: StatesGetters): StateSummary|null {
  if (!getters.hasFocusedState) {
    return null
  }
  return getters.findState(moduleState.focusedStateId)
}

function hasFocusedState (moduleState: StatesModuleState): boolean {
  return moduleState.focusedStateId !== null
}

function isFocused (moduleState: StatesModuleState): (string) => boolean {
  return function (stateId) {
    return moduleState.focusedStateId === stateId
  }
}

function focusedStateId (moduleState: StatesModuleState): string|null {
  return moduleState.focusedStateId
}

function initial (moduleState: StatesModuleState): string|null {
  return moduleState.initial
}

function hasInitial (moduleState: StatesModuleState): boolean {
  return moduleState.initial !== null
}

function isInitial (moduleState: StatesModuleState): (string) => boolean {
  return function (id) {
    return id === moduleState.initial
  }
}

function phonebookSubsetForStates (_, getters: StatesGetters): PhonebookSubsetForStates {
  return serialize(getters)
}
