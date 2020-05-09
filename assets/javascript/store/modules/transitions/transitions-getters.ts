import { TransitionModuleState } from './transitions-module-state'
import { gistWhen } from './transition-gist'
import { TransitionSummary, TransitionState, summarize } from './transition'
import { PhonebookTransitions } from 'assets/javascript/phonebook/phonebook-transitions'
import { serialize } from './transitions-serialize'
import { StatesGetters } from '../states/states-getters'
import { EditorGetters } from '../editor/editor-getters'

export const getters = {
  activeTransitions,
  summaries,
  transitionSummariesFrom,
  transitionSummariesTo,
  transitionSummariesWith,
  transitions
}

export interface TransitionGetters {
  readonly activeTransitions: TransitionState[]
  readonly summaries: TransitionSummary[]
  transitionSummariesFrom(stateId: string): TransitionSummary[]
  transitionSummariesTo(stateId: string): TransitionSummary[]
  transitionSummariesWith(stateId: string): TransitionSummary[]
  readonly transitions: PhonebookTransitions
}

/**
 * Getters that are expected to be available on root for the getters to properly
 * function.
 * 
 * Exported for tests only.
 */
export type TransitionRootGetters = StatesGetters & EditorGetters

/**
 * Transition edges without the extra metadata in `fromName`, `toName` and
 * `when`.
 */
function activeTransitions (state: TransitionModuleState, _getters, _rootState, rootGetters: TransitionRootGetters): TransitionState[] {
  return state.transitions
    // Hide the removed transitions, and those where the originating or traget state is removed.
    .filter(summary => !(summary.removed ||
      rootGetters.isRemoved(summary.from) ||
      rootGetters.isRemoved(summary.to)))
}

/**
 * Gets the active transition summaries and fills in the optional name
 * properties.
 *
 * @param _state unused transition states
 * @param getters  getters from context
 * @param _rootState unused root state
 * @param rootGetters root getters, to find the name of a state
 */
function summaries (_state, getters, _rootState, rootGetters: TransitionRootGetters): TransitionSummary[] {
  const names = new Map<string, string>()

  return getters.activeTransitions
    // Fill in optional metadata for convenience of UI code
    .map(state => summarize(state, name))

  function name (ofStateId: string): string {
    const cachedName = names.get(ofStateId)
    if (typeof cachedName !== 'undefined') {
      return cachedName
    }

    const state = rootGetters.findState(ofStateId)
    if (typeof state === 'undefined') {
      throw new Error(`Cannot get name of undefined state ${ofStateId}`)
    }

    names.set(ofStateId, state.name)
    return state.name
  }
}

function transitionSummariesFrom (_transitions, getters) {
  /**
   * Gets an array of descriptions for all transition edges originating
   * from the given ID.
   *
   * The properties include those returned from `transitionEdgesFrom`:
   * * Unique transition type name: `type`,
   * * ID of originating state: `from`,
   * * ID of target state: `to`
   *
   * And some addition properties for humans:
   * * Human-readable description of the transition condition, `when` e.g.: `'Pick up'`, `'Dial 8'`,
   * * given name of originating state, may not be unique, `fromName`, e.g.: `'State 1'`, `'Any'`
   * * given name of target state, may not be unique, `toName`, e.g.: `'State 2'`.
   *
   * @param id ID of originating state
   * @returns transition edge descriptions
   */
  return function transitionSummariesFrom (id: string): TransitionSummary[] {
    const summaries: TransitionSummary[] = getters.summaries
    return summaries.filter(summary => summary.from === id)
  }
}

function transitionSummariesTo (_transitions, getters) {
  /**
   * Gets an array of descriptions for all transition edges ending at
   * the given ID.
   *
   * The properties include those returned from `transitionEdgesFrom`:
   * * Unique transition type name: `type`,
   * * ID of originating state: `from`,
   * * ID of target state: `to`
   *
   * And some addition properties for humans:
   * * Human-readable description of the transition condition, `when` e.g.: `'Pick up'`, `'Dial 8'`,
   * * given name of originating state, may not be unique, `fromName`, e.g.: `'State 1'`, `'Any'`
   * * given name of target state, may not be unique, `toName`, e.g.: `'State 2'`.
   *
   * @param id ID of ending state
   * @returns transition edge descriptions
   */
  return function transitionSummariesFrom (id: string): TransitionSummary[] {
    const summaries: TransitionSummary[] = getters.summaries
    return summaries.filter(summary => summary.to === id)
  }
}

function transitionSummariesWith (_transitions, getters) {
  /**
   * Gets an array of descriptions for all transition edges ending or
   * starting at the given ID.
   *
   * The properties include those returned from `transitionEdgesFrom`:
   * * Unique transition type name: `type`,
   * * ID of originating state: `from`,
   * * ID of target state: `to`
   *
   * And some addition properties for humans:
   * * Human-readable description of the transition condition, `when` e.g.: `'Pick up'`, `'Dial 8'`,
   * * given name of originating state, may not be unique, `fromName`, e.g.: `'State 1'`, `'Any'`
   * * given name of target state, may not be unique, `toName`, e.g.: `'State 2'`.
   *
   * @param id ID of ending state
   * @returns transition edge descriptions
   */
  return function transitionSummariesWith (id: string): TransitionSummary[] {
    const summaries: TransitionSummary[] = getters.summaries
    return summaries.filter(summary => summary.from === id || summary.to === id)
  }
}

/**
 * Transitions in phonebook format.
 */
function transitions (_state, getters): PhonebookTransitions {
  return serialize(
    // Serialize unless deleted or involved state is deleted
    getters.activeTransitions
  )
}
