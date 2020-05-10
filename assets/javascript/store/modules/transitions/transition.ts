/**
 * Different representation of a transition that are useful for building an
 * editor, but is different from the final phonebook format.
 *
 * For instance, the summary representation has stringified summaries
 * of the transition condition, the names of source and target
 * states, a deleted flag, etc., while the final phonebook format is
 * pretty minimal and optimized for access during evaluation, not so
 * much for editing.
 */

import uuidV4 from '../../../util/random/uuid'
import { gistWhen } from './transition-gist'

export function createTransition (input: TransitionSpec): TransitionState {
  return {
    id: uuidV4(),
    removed: false,
    ...input
  }
}

export function summarize (state: TransitionState, findName: (id: string) => string): TransitionSummary {
  return {
    ...state,
    fromName: findName(state.from),
    toName: findName(state.to),
    when: gistWhen(state)
  }
}

export type Transition = Dial | Timeout | PickUp | HangUp | End

/**
  * Persisted state of a transition.
  */
export type TransitionState = DialState | TimeoutState | PickUpState | HangUpState | EndState

/**
 * Specification from the editor for a new transition.
 */
export type TransitionSpec = Transition

/**
 * Summary to give the editors for display with useful
 * computed properteis that are not persisted.
 */
export type TransitionSummary = DialSummary | TimeoutSummary | PickUpSummary | HangUpSummary | EndSummary

export type DialState = StateCommon & Dial
export type TimeoutState = StateCommon & Timeout
export type PickUpState = StateCommon & PickUp
export type HangUpState = StateCommon & HangUp
export type EndState = StateCommon & End

export type DialSummary = SummaryCommon & Dial
export type TimeoutSummary = SummaryCommon & Timeout
export type PickUpSummary = SummaryCommon & PickUp
export type HangUpSummary = SummaryCommon & HangUp
export type EndSummary = SummaryCommon & End

export interface StateCommon {
  /**
   * UUID of the transition.
   */
  id: string
  /**
   * If `true`, this transition is not a tombstone and can be
   * considered active, meaning it should be presented to users.
   *
   * If `false`, this is removed and should not be presented
   * to the user.
   */
  removed: boolean
}

/**
 * Additional fields that are not part of the inherent state but
 * are useful for the UI, e.g. computed fields for a summary and
 * the names of source and target states.
 */
export interface SummaryCommon {
  /**
   * UUID of the transition.
   */
  id: string
  /**
   * An optional string summary of the transition condition for users.
   */
  when: string
  /**
   * Optional string name of the originating state,
   * which is not unique but useful for user interfaces.
   */
  fromName: string
  /**
   * Optional string name of the target state,
   * which is not unique but useful for user interfaces.
   */
  toName: string
}

/**
  * Shared fields of all transition summary types.
  */
export interface TransitionCommon {
  /**
   * Type of the transition
   *
   * Iimplies the exact type and contents of the options`
   * field.
   */
  type: TransitionType
  /**
   * State ID of the originating state.
   */
  from: string
  /**
   * State ID of the target state.
   */
  to: string
}

export interface Dial extends TransitionCommon {
  type: TransitionType.Dial
  /**
   * String that must be input via phone, e.g. "0", or "123"
   */
  pattern: string
}

export interface Timeout extends TransitionCommon {
  type: TransitionType.Timeout
  /**
   * Timeout in seconds.
   *
   * Must be positive and non-zero. Can be fractional.
   */
  after: number
}

export interface PickUp extends TransitionCommon {
  type: TransitionType.PickUp
}

export interface HangUp extends TransitionCommon {
  type: TransitionType.HangUp
}

export interface End extends TransitionCommon {
  type: TransitionType.End
}

export const enum TransitionType {
  Dial = 'dial',
  Timeout = 'timeout',
  PickUp = 'pick_up',
  HangUp = 'hang_up',
  End = 'end'
}
