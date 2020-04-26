import { TransitionSummary, TransitionType } from './transition'

export default function isTransitionEqual (a: TransitionSummary, b: TransitionSummary): boolean {
  if (a.from !== b.from) {
    return false
  }

  if (a.to !== b.to) {
    return false
  }

  if (a.type === TransitionType.Dial && b.type === TransitionType.Dial) {
    return a.pattern === b.pattern
  } else if (a.type === TransitionType.Timeout && b.type === TransitionType.Timeout) {
    return a.after === b.after
  } else if (a.type === TransitionType.PickUp && b.type === TransitionType.PickUp) {
    return true // no properties to compare, equal
  } else if (a.type === TransitionType.HangUp && b.type === TransitionType.HangUp) {
    return true // no properties to compare, equal
  } else if (a.type === TransitionType.End && b.type === TransitionType.End) {
    return true // no properties to compare, equal
  }

  // different types or properties were not equal
  // rmeoved is deliberately ignored
  return false
}
