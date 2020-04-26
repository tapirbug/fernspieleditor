import {
  TransitionSummary,
  TransitionType,
  DialSummary,
  EndSummary,
  HangUpSummary,
  PickUpSummary,
  TimeoutSummary
} from './transition'
import {
  PhonebookTransitions,
  PhonebookTransitionsForSourceState,
  PhonebookDialPatterns,
  PhonebookTimeoutOptions
} from '../../../phonebook/phonebook-transitions'

export function deserialize (transitions: PhonebookTransitions): TransitionSummary[] {
  const summaries = []
  for (const [sourceState, transitionsForSource] of Object.entries(transitions)) {
    summaries.push(
      ...deserializeTransitionsFrom(sourceState, transitionsForSource)
    )
  }
  return summaries
}

function deserializeTransitionsFrom (sourceState: string, transitionsForSource: PhonebookTransitionsForSourceState): TransitionSummary[] {
  const summaries = []
  if (typeof transitionsForSource.dial !== 'undefined') {
    summaries.push(
      ...deserializeDialSummaries(
        sourceState,
        transitionsForSource.dial
      )
    )
  }
  if (typeof transitionsForSource.timeout !== 'undefined') {
    summaries.push(
      deserializeTimeout(sourceState, transitionsForSource.timeout)
    )
  }
  if (typeof transitionsForSource.end !== 'undefined') {
    summaries.push(
      deserializeEndSummary(sourceState, transitionsForSource.end)
    )
  }
  if (typeof transitionsForSource.hang_up !== 'undefined') {
    summaries.push(
      deserializeHangUpSummary(sourceState, transitionsForSource.hang_up)
    )
  }
  if (typeof transitionsForSource.pick_up !== 'undefined') {
    summaries.push(
      deserializePickUpSummary(sourceState, transitionsForSource.pick_up)
    )
  }
  return summaries
}

function deserializeDialSummaries (from: string, options: PhonebookDialPatterns): DialSummary[] {
  const summaries = []
  for (const [pattern, to] of Object.entries(options)) {
    const summary: DialSummary = {
      type: TransitionType.Dial,
      removed: false,
      from,
      to,
      pattern
    }
    summaries.push(summary)
  }
  return summaries
}

function deserializeTimeout (from: string, { to, after }: PhonebookTimeoutOptions): TimeoutSummary {
  return {
    type: TransitionType.Timeout,
    removed: false,
    from,
    to,
    after
  }
}

function deserializeEndSummary (from: string, to: string): EndSummary {
  return {
    type: TransitionType.End,
    removed: false,
    from,
    to
  }
}

function deserializeHangUpSummary (from: string, to: string): HangUpSummary {
  return {
    type: TransitionType.HangUp,
    removed: false,
    from,
    to
  }
}

function deserializePickUpSummary (from: string, to: string): PickUpSummary {
  return {
    type: TransitionType.PickUp,
    removed: false,
    from,
    to
  }
}
