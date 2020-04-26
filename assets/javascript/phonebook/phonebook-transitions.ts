/**
 * A transition map in phonebook format.
 */
export interface PhonebookTransitions {
  [statesAgainstTransitions: string]: PhonebookTransitionsForSourceState
}

export interface PhonebookTransitionsForSourceState {
  pick_up?: string
  hang_up?: string
  end?: string
  dial?: PhonebookDialPatterns
  timeout?: PhonebookTimeoutOptions
}
export interface PhonebookDialPatterns {
  [patternsAgainstTargetStates: string]: string
}
export interface PhonebookTimeoutOptions {
  after: number
  to: string
}
