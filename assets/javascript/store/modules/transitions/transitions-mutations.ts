import {
  PUSH_TRANSITION,
  SET_TRANSITION_REMOVED,
  SET_TRANSITION_REVIVED,
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'
import { deserialize } from './transitions-deserialize'
import { TransitionModuleState } from './transitions-module-state.js'
import { TransitionState } from './transition.js'
import { Phonebook } from 'assets/javascript/phonebook/phonebook'

export default {
  [PUSH_TRANSITION]: pushTransition,
  [SET_TRANSITION_REMOVED]: removeTransition,
  [SET_TRANSITION_REVIVED]: reviveTransition,
  [REPLACE_PHONEBOOK]: replacePhonebook
}

function pushTransition (state: TransitionModuleState, newTransition: TransitionState): void {
   // first time adding this transition, add to the end
  state.transitions.push(newTransition)
}

function removeTransition (state: TransitionModuleState, id: string): void {
  for (const existingTransition of state.transitions) {
    if (existingTransition.id === id) {
      existingTransition.removed = true
      return
    }
  }

  throw new Error('Transition could not be removed because it was not found: ' +
  `${id}`)
}

function reviveTransition (state: TransitionModuleState, id: string): void {
  for (const existingTransition of state.transitions) {
    if (existingTransition.id === id) {
      existingTransition.removed = false
      return
    }
  }

  throw new Error('Transition could not be revived because it was not found: ' +
  `${id}`)
}

function replacePhonebook (state: TransitionModuleState, { transitions }: Phonebook): void {
  state.transitions = deserialize(transitions)
}
