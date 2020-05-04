import { Transition, TransitionState } from './transition'

export interface TransitionModuleState {
  transitions: TransitionState[]
}

export function defaultTransitionsState (): TransitionModuleState {
  return { transitions: [] }
}
