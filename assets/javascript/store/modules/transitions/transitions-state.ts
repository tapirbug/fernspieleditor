import { TransitionSummary } from './transition'

export interface TransitionsState {
  transitions: TransitionSummary[]
}

export function defaultTransitionsState (): TransitionsState {
  return { transitions: [] }
}
