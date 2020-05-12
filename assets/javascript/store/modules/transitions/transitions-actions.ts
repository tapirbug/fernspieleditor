import { ADD_TRANSITION, REMOVE_TRANSITION } from '../../action-types'
import {
  PUSH_TRANSITION,
  SET_TRANSITION_REMOVED,
  SET_TRANSITION_REVIVED
} from '../../mutation-types'
import areTransitionsMutuallyExclusive from './transition-exclusive'
import { TransitionSummary, TransitionSpec, createTransition, TransitionState, summarize } from './transition'
import { Step, StepSpec } from '../undo/undo-step'
import performReversible from '../undo/undo-reversible'

export interface TransitionsActions {
  addTransition(spec: TransitionSpec): Promise<TransitionSummary>
  removeTransition(transitionId: string)
}

export const actions = {
  [ADD_TRANSITION]: addTransition,
  [REMOVE_TRANSITION]: removeTransition
}

export const transitionActionMapping = {
  addTransition: ADD_TRANSITION,
  removeTransition: REMOVE_TRANSITION
}

/**
 * Adds the given transition and returns its ID.
 *
 * @param ctx vuex context
 * @param newTransition
 */
function addTransition ({ commit, getters, rootGetters }, input: TransitionSpec): TransitionSummary {
  const transition = createTransition(input)
  const summary = summarize(
    transition,
    id => rootGetters.findState(id).name
  )
  performReversible(
    commit,
    `Add transition "${summary.when}" on state ${summary.fromName}`,
    addTransitionSteps(getters, transition)
  )
  return summary
}

function addTransitionSteps (getters, transition: TransitionState): Step[] {
  const steps = []
  for (const existingTransition of getters.summaries as TransitionSummary[]) {
    if (areTransitionsMutuallyExclusive(existingTransition, transition)) {
      // e.g. if there already is a "Dial 5" on this state, or if there already is a "Pick Up"
      const removeConflicting: StepSpec = {
        mutation: SET_TRANSITION_REMOVED,
        payload: existingTransition.id,
        undoMutation: SET_TRANSITION_REVIVED,
        undoPayload: existingTransition.id
      }
      steps.push(removeConflicting)
    }
  }

  const addNew: Step = {
    mutation: PUSH_TRANSITION,
    payload: transition,
    undoMutation: SET_TRANSITION_REMOVED,
    undoPayload: transition.id,
    redoMutation: SET_TRANSITION_REVIVED,
    redoPayload: transition.id
  }
  steps.push(addNew)

  return steps
}

function removeTransition ({ commit }, transitionId: string) {
  performReversible(
    commit,
    `Remove transition ${transitionId}`,
    {
      mutation: SET_TRANSITION_REMOVED,
      undoMutation: SET_TRANSITION_REVIVED,
      payload: transitionId
    }
  )
}
