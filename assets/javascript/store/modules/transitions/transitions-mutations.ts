import {
  ADD_TRANSITION,
  REMOVE_TRANSITION,
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'
import { deserialize } from './transitions-deserialize'
import { TransitionsState } from './transitions-state.js'
import { TransitionSummary } from './transition.js'
import { Phonebook } from 'assets/javascript/phonebook/phonebook'
import isTransitionEqual from './transition-equal'

export default {
  [ADD_TRANSITION]: addTransition,
  [REMOVE_TRANSITION]: removeTransition,
  [REPLACE_PHONEBOOK]: replacePhonebook
}

function addTransition (state: TransitionsState, newTransition: TransitionSummary): void {
  newTransition = minimalTransition(newTransition)
  for (const existingTransition of state.transitions) {
    if (isTransitionEqual(newTransition, existingTransition)) {
      // has been added before, un-delete it
      existingTransition.removed = false
      return
    }
  }

  // first time adding this transition, add to the end
  state.transitions.push(newTransition)
}

function removeTransition (state: TransitionsState, toRemove: TransitionSummary): void {
  toRemove = minimalTransition(toRemove)

  for (const existingTransition of state.transitions) {
    if (isTransitionEqual(existingTransition, toRemove)) {
      existingTransition.removed = true
      return
    }
  }

  throw new Error('Transition could not be removed because it was not found: ' +
  `${JSON.stringify(toRemove)}`)
}

function replacePhonebook (state: TransitionsState, { transitions }: Phonebook): void {
  state.transitions = deserialize(transitions)
}

/**
 * Gets a copy of the transition without the additional metadata properties.
 *
 * Then we can compare it with the transitions in our store.
 *
 * @param fatTransition transition to get minimal version of
 */
function minimalTransition (fatTransition: TransitionSummary): TransitionSummary {
  const transition = { ...fatTransition }
  delete transition.fromName
  delete transition.toName
  delete transition.when
  return transition
}
