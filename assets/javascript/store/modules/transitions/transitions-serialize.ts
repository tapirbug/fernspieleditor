import {
  TransitionSummary,
  DialSummary,
  TimeoutSummary,
  PickUpSummary,
  HangUpSummary,
  EndSummary,
  TransitionType
} from './transition'
import {
  PhonebookTransitions,
  PhonebookTransitionsForSourceState
} from '../../../phonebook/phonebook-transitions'

export function serialize (summaries: TransitionSummary[]): PhonebookTransitions {
  const transitions = {}
  for (const summary of summaries) {
    serializeSummary(summary, transitions)
  }
  return transitions
}

function serializeSummary (summary: TransitionSummary, transitionsPerSource: PhonebookTransitions): void {
  if (!summary.removed) {
    const transitions: PhonebookTransitionsForSourceState =
      typeof transitionsPerSource[summary.from] === 'undefined'
      // start with empty transition map for source state
        ? (transitionsPerSource[summary.from] = {})
      // already have one transition, continue
        : transitionsPerSource[summary.from]

    // then add transitions to the map
    switch (summary.type) {
      case TransitionType.Dial:
        serializeDial(summary, transitions)
        break

      case TransitionType.Timeout:
        serializeTimeout(summary, transitions)
        break

      case TransitionType.PickUp:
        serializePickUp(summary, transitions)
        break

      case TransitionType.HangUp:
        serializeHangUp(summary, transitions)
        break

      case TransitionType.End:
        serializeEnd(summary, transitions)
        break

      default:
        throw new Error(`unhandled type: ${JSON.stringify(summary)}`)
    }
  }
}

function serializeDial (summary: DialSummary, transitions: PhonebookTransitionsForSourceState): void {
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

function serializeTimeout (summary: TimeoutSummary, transitions: PhonebookTransitionsForSourceState): void {
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

function serializePickUp (summary: PickUpSummary, transitions: PhonebookTransitionsForSourceState): void {
  if (typeof transitions.pick_up !== 'undefined') {
    throw new Error(
      'Encountered more than one pick up transition, ' +
      `already in phonebook: ${JSON.stringify(transitions.pick_up)}, ` +
      `conflicting additional pick up summary: ${JSON.stringify(summary)}`
    )
  }
  transitions.pick_up = summary.to
}

function serializeHangUp (summary: HangUpSummary, transitions: PhonebookTransitionsForSourceState): void {
  if (typeof transitions.hang_up !== 'undefined') {
    throw new Error(
      'Encountered more than one hang up transition, ' +
      `already in phonebook: ${JSON.stringify(transitions.hang_up)}, ` +
      `conflicting additional hang up summary: ${JSON.stringify(summary)}`
    )
  }
  transitions.hang_up = summary.to
}

function serializeEnd (summary: EndSummary, transitions: PhonebookTransitionsForSourceState): void {
  if (typeof transitions.end !== 'undefined') {
    throw new Error(
      'Encountered more than one state end transition, ' +
      `already in phonebook: ${transitions.end}, ` +
      `conflicting additional timeout summary: ${JSON.stringify(summary)}`
    )
  }
  transitions.end = summary.to
}
