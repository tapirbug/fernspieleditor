/**
 * A representation of a transition that is useful for building an
 * editor, but is different from the final phonebook format.
 *
 * For instance, the summary representation has stringified summaries
 * of the transition condition, the names of source and target
 * states, a deleted flag, etc., while the final phonebook format is
 * pretty minimal and optimized for access during evaluation, not so
 * much for editing.
 */
export type TransitionSummary =
  DialSummary | TimeoutSummary | PickUpSummary | HangUpSummary | EndSummary

/**
  * Shared fields of all transition summary types.
  */
interface TransitionSummaryCommon {
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
  /**
   * If `true`, this transition has not been removed and
   * is still active.
   *
   * If `false`, this is removed and should not be presented
   * to the user.
   */
  removed: boolean
  /**
   * An optional string summary of the transition condition for users.
   */
  when?: string
  /**
   * Optional string name of the originating state,
   * which is not unique but useful for user interfaces.
   */
  fromName?: string
  /**
   * Optional string name of the target state,
   * which is not unique but useful for user interfaces.
   */
  toName?: string
}

export interface DialSummary extends TransitionSummaryCommon {
  type: TransitionType.Dial
  /**
   * String that must be input via phone, e.g. "0", or "123"
   */
  pattern: string
}

export interface TimeoutSummary extends TransitionSummaryCommon {
  type: TransitionType.Timeout
  /**
   * Timeout in seconds.
   *
   * Must be positive and non-zero. Can be fractional.
   */
  after: number
}

export interface PickUpSummary extends TransitionSummaryCommon {
  type: TransitionType.PickUp
}

export interface HangUpSummary extends TransitionSummaryCommon {
  type: TransitionType.HangUp
}

export interface EndSummary extends TransitionSummaryCommon {
  type: TransitionType.End
}

export const enum TransitionType {
  Dial = 'dial',
  Timeout = 'timeout',
  PickUp = 'pick_up',
  HangUp = 'hang_up',
  End = 'end'
}
