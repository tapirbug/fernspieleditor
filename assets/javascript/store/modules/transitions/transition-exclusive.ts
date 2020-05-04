import { TransitionType, Transition } from './transition'

export default function areTransitionsMutuallyExclusive (a: Transition, b: Transition): boolean {
  if (a.from !== b.from) {
    // different origin states => fine
    return false
  }

  if (a.type === TransitionType.Dial && b.type === TransitionType.Dial) {
    return a.pattern === b.pattern // each pattern can only exist once
  } else if (a.type === TransitionType.Timeout && b.type === TransitionType.Timeout) {
    return true // each transition source can only have one timeout transtion
  } else if (a.type === TransitionType.PickUp && b.type === TransitionType.PickUp) {
    return true // each transition source can only have one pick up transtion
  } else if (a.type === TransitionType.HangUp && b.type === TransitionType.HangUp) {
    return true // each transition source can only have one hang up transtion
  } else if (a.type === TransitionType.End && b.type === TransitionType.End) {
    return true // each transition source can only have one speech end transtion
  }

  return false // all mutually exclusivity covered => b can exist alongside a => true
}
