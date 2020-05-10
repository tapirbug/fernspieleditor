import { StateState } from './state'

export interface StatesModuleState {
  states: StateState[]
  focusedStateId: string|null
  initial: string|null
}
