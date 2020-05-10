import { StatesModuleState } from './states-module-state'
import { createState, PhonebookSubsetForStates, StateState } from './state'
import { Vec2D } from 'assets/javascript/util/geom/vec2d'

const anyId = 'any'

export function deserialize (phonebook: PhonebookSubsetForStates): StatesModuleState {
  const {
    states,
    vendor: { fernspieleditor: { focusedStateId, extensionProperties: { states: statesExt } } }
  } = phonebook
  const focusedStateIdOrNull = typeof focusedStateId === 'string' ? focusedStateId : null

  let any: StateState = createState({
    id: anyId,
    name: 'Any',
    description: 'Transitions from any are used when the current state has no transition defined for an event.',
    position: {
      x: 100,
      y: 100
    }
  })

  const persistedStates: StateState[] =
    Object.entries(states)
      .map(
        ([id, phonebookProps]) => {
          const position: Vec2D = id in statesExt
            ? statesExt[id].network.position
            : { x: 300, y: 300 }
          const stateState: StateState = createState({
            id,
            ...phonebookProps,
            position
          })
          return stateState
        }
      )
      .reduce(
        (acc, state) => {
          if (state.id === anyId) {
            any = {
              ...any,
              ...state
            }
          } else {
            acc.push(state)
          }
          return acc
        },
        []
      )
  return {
    states: [any].concat(persistedStates),
    focusedStateId: focusedStateIdOrNull,
    initial: phonebook.initial
  }
}
