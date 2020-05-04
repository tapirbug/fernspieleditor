import {
  TransitionType,
  Dial,
  End,
  HangUp,
  PickUp,
  Timeout,
  TransitionState,
  TransitionSpec,
  createTransition
} from './transition'
import {
  PhonebookTransitions,
  PhonebookTransitionsForSourceState,
  PhonebookDialPatterns,
  PhonebookTimeoutOptions
} from '../../../phonebook/phonebook-transitions'

export function deserialize (transitions: PhonebookTransitions): TransitionState[] {
  const summaries = []
  for (const [sourceState, transitionsForSource] of Object.entries(transitions)) {
    summaries.push(
      ...deserializeTransitionsFrom(sourceState, transitionsForSource)
    )
  }
  return summaries
}

function deserializeTransitionsFrom (sourceState: string, transitionsForSource: PhonebookTransitionsForSourceState): TransitionState[] {
  const transitions : TransitionSpec[] = []
  if (typeof transitionsForSource.dial !== 'undefined') {
    transitions.push(
      ...deserializeDialSummaries(
        sourceState,
        transitionsForSource.dial
      )
    )
  }
  if (typeof transitionsForSource.timeout !== 'undefined') {
    transitions.push(
      deserializeTimeout(sourceState, transitionsForSource.timeout)
    )
  }
  if (typeof transitionsForSource.end !== 'undefined') {
    transitions.push(
      deserializeEndSummary(sourceState, transitionsForSource.end)
    )
  }
  if (typeof transitionsForSource.hang_up !== 'undefined') {
    transitions.push(
      deserializeHangUpSummary(sourceState, transitionsForSource.hang_up)
    )
  }
  if (typeof transitionsForSource.pick_up !== 'undefined') {
    transitions.push(
      deserializePickUpSummary(sourceState, transitionsForSource.pick_up)
    )
  }
  return transitions.map(createTransition)
}

function deserializeDialSummaries (from: string, options: PhonebookDialPatterns): Dial[] {
  const summaries = []
  for (const [pattern, to] of Object.entries(options)) {
    const dial: Dial = {
      type: TransitionType.Dial,
      from,
      to,
      pattern
    }
    summaries.push(dial)
  }
  return summaries
}

function deserializeTimeout (from: string, { to, after }: PhonebookTimeoutOptions): Timeout {
  return {
    type: TransitionType.Timeout,
    from,
    to,
    after
  }
}

function deserializeEndSummary (from: string, to: string): End {
  return {
    type: TransitionType.End,
    from,
    to
  }
}

function deserializeHangUpSummary (from: string, to: string): HangUp {
  return {
    type: TransitionType.HangUp,
    from,
    to
  }
}

function deserializePickUpSummary (from: string, to: string): PickUp {
  return {
    type: TransitionType.PickUp,
    from,
    to
  }
}
