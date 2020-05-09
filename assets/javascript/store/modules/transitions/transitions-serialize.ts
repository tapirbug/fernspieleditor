import {
  Dial,
  Timeout,
  PickUp,
  HangUp,
  End,
  TransitionType,
  Transition
} from './transition'
import {
  PhonebookTransitions,
  PhonebookTransitionsForSourceState
} from '../../../phonebook/phonebook-transitions'

export function serialize (transitionsFromState: Transition[]): PhonebookTransitions {
  const phonebookTransitions = {}
  for (const transition of transitionsFromState) {
    serializeState(transition, phonebookTransitions)
  }
  return phonebookTransitions
}

function serializeState (state: Transition, transitionsPerSource: PhonebookTransitions): void {
  const transitions: PhonebookTransitionsForSourceState =
    typeof transitionsPerSource[state.from] === 'undefined'
    // start with empty transition map for source state
      ? (transitionsPerSource[state.from] = {})
    // already have one transition, continue
      : transitionsPerSource[state.from]

  // then add transitions to the map
  switch (state.type) {
    case TransitionType.Dial:
      serializeDial(state, transitions)
      break

    case TransitionType.Timeout:
      serializeTimeout(state, transitions)
      break

    case TransitionType.PickUp:
      serializePickUp(state, transitions)
      break

    case TransitionType.HangUp:
      serializeHangUp(state, transitions)
      break

    case TransitionType.End:
      serializeEnd(state, transitions)
      break

    default:
      throw new Error(`unhandled type: ${JSON.stringify(state)}`)
  }
}

function serializeDial (summary: Dial, transitions: PhonebookTransitionsForSourceState): void {
  if (typeof transitions.dial === 'undefined') {
    transitions.dial = {}
  }

  if (typeof transitions.dial[summary.pattern] === 'string') {
    throw new Error(
      'Encountered more than one identical dial pattern, ' +
      `already in phonebook: ${JSON.stringify(transitions.dial)}, ` +
      `conflicting additional timeout summary: ${JSON.stringify(summary)}`
    )
  }

  transitions.dial = {
    ...transitions.dial,
    [summary.pattern]: summary.to
  }
}

function serializeTimeout (summary: Timeout, transitions: PhonebookTransitionsForSourceState): void {
  if (typeof transitions.timeout !== 'undefined') {
    throw new Error(
      'Encountered more than one timeout transition, ' +
      `already in phonebook: ${JSON.stringify(transitions.timeout)}, ` +
      `conflicting additional timeout summary: ${JSON.stringify(summary)}`
    )
  }

  transitions.timeout = {
    after: summary.after,
    to: summary.to
  }
}

function serializePickUp (summary: PickUp, transitions: PhonebookTransitionsForSourceState): void {
  if (typeof transitions.pick_up !== 'undefined') {
    throw new Error(
      'Encountered more than one pick up transition, ' +
      `already in phonebook: ${JSON.stringify(transitions.pick_up)}, ` +
      `conflicting additional pick up summary: ${JSON.stringify(summary)}`
    )
  }
  transitions.pick_up = summary.to
}

function serializeHangUp (summary: HangUp, transitions: PhonebookTransitionsForSourceState): void {
  if (typeof transitions.hang_up !== 'undefined') {
    throw new Error(
      'Encountered more than one hang up transition, ' +
      `already in phonebook: ${JSON.stringify(transitions.hang_up)}, ` +
      `conflicting additional hang up summary: ${JSON.stringify(summary)}`
    )
  }
  transitions.hang_up = summary.to
}

function serializeEnd (summary: End, transitions: PhonebookTransitionsForSourceState): void {
  if (typeof transitions.end !== 'undefined') {
    throw new Error(
      'Encountered more than one state end transition, ' +
      `already in phonebook: ${transitions.end}, ` +
      `conflicting additional timeout summary: ${JSON.stringify(summary)}`
    )
  }
  transitions.end = summary.to
}
