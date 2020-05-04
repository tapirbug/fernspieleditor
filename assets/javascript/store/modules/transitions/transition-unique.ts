import { TransitionSummary, TransitionType } from './transition'

export default function isTransitionUnique (summary: TransitionSummary): boolean {
  return summary.type === TransitionType.PickUp ||
    summary.type === TransitionType.HangUp ||
    summary.type === TransitionType.Timeout ||
    summary.type === TransitionType.End
    // everything except dial can only have one transition at a time
}
