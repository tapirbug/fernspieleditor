import { TransitionSummary, TransitionType } from './transition'

/**
 * Short summary of the transition condition, e.g. "Type 4".
 *
 * @param summary transition to summarize
 * @return the short summary
 */
export function gistWhen (summary: TransitionSummary): string {
  switch (summary.type) {
    case TransitionType.Dial:
      return `Dial ${summary.pattern}`
    case TransitionType.Timeout:
      return `Timeout (${summary.after}s)`
    case TransitionType.PickUp:
      return 'Pick up'
    case TransitionType.HangUp:
      return 'Hang up'
    case TransitionType.End:
      return 'Speech end'
  }
}
