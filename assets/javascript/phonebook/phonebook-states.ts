export interface PhonebookState {
  name: string
  description: string
  sounds: string[]
  ring: number
  terminal: boolean
}

export interface PhonebookStates {
  [stateIdsAgainstStates: string]: PhonebookState
}

/**
 * A newly added, blank state
 */
export function defaultState (): PhonebookState {
  return {
    name: 'New State',
    description: '',
    sounds: [],
    ring: 0.0,
    terminal: false
  }
}
