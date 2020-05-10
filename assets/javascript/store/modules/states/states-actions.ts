import {
  PUSH_STATE,
  SET_STATE_REMOVED,
  SET_STATE_REVIVED,
  REPLACE_STATE,
  FOCUS_STATE as ACTION_FOCUS_STATE,
  MAKE_INITIAL_STATE
} from '../../mutation-types'
import {
  ADD_STATE,
  REMOVE_STATE,
  UPDATE_STATE,
  CONTINUE_UPDATE_STATE,
  FOCUS_STATE as MUTATION_FOCUS_STATE,
  SET_INITIAL_STATE
} from '../../action-types'
import { ActionContext } from 'vuex'
import { StateSpec, createState, StateSummary, summarize } from './state'
import { StatesModuleState } from './states-module-state.js'
import { StatesGetters } from './states-getters.js'
import performReversible from '../undo/undo-reversible'
import { TransitionGetters } from '../transitions/transitions-getters.js'
import { StepSpec } from '../undo/undo-step.js'

export interface StatesActions {
  addState(spec: StateSpec): Promise<StateSummary>
  updateState(spec: StateSpec): Promise<StateSummary>
  removeState(stateId: string): void
  continueUpdateState(spec: StateSpec): void
  focusState(id: string|null): void
  setInitialState(id: string|null): void
}

export const statesActionMapping = {
  addState: ADD_STATE,
  removeState: REMOVE_STATE,
  updateState: UPDATE_STATE,
  continueUpdateState: CONTINUE_UPDATE_STATE,
  focusState: ACTION_FOCUS_STATE,
  setInitialState: SET_INITIAL_STATE
}

export const actions = {
  [statesActionMapping.addState]: addState,
  [statesActionMapping.removeState]: removeState,
  [statesActionMapping.updateState]: updateState,
  [statesActionMapping.continueUpdateState]: continueUpdateState(),
  [statesActionMapping.focusState]: focusState,
  [statesActionMapping.setInitialState]: setInitialState
}

interface StatesContext extends ActionContext<StatesModuleState, object> {
  getters: StatesGetters,
  rootGetters: TransitionGetters
}

function addState({ commit }: StatesContext, spec: StateSpec): StateSummary {
  const state = createState(spec)
  performReversible(
    commit,
    "Add state",
    {
      mutation: PUSH_STATE,
      payload: state,
      undoMutation: SET_STATE_REMOVED,
      undoPayload: state.id,
      redoMutation: SET_STATE_REVIVED,
      redoPayload: state.id
    }
  )
  return summarize(state)
}

function removeState({ commit, state }: StatesContext, stateIdToRemove: string): void {
  if (stateIdToRemove === 'any') {
    throw new Error("The any state cannot be removed")
  }

  if (!state.states.some(({ id }) => id === stateIdToRemove)) {
    throw new Error(`Trying to remove ${stateIdToRemove} but no state with such an ID exists`)
  }

  // TODO make sure initial states are properly undoable

  performReversible(
    commit,
    "Remove state",
    removeStateSteps()
  )

  function removeStateSteps(): StepSpec[] {
    const steps: StepSpec[] = []

    if (stateIdToRemove === state.focusedStateId) {
      // if the ID is currenlty focused, restore the focus when undoing
      // the removal
      steps.push({
        mutation: MUTATION_FOCUS_STATE,
        payload: null,
        undoPayload: stateIdToRemove
      })
    }

    if (stateIdToRemove === state.initial) {
      // the ID to remove is set as the initial state, we no longer have one
      steps.push({
        mutation: MAKE_INITIAL_STATE,
        payload: null,
        undoPayload: stateIdToRemove
      })
    }

    // then we can do the actual removal
    steps.push({
      mutation: SET_STATE_REMOVED,
      payload: stateIdToRemove,
      undoMutation: SET_STATE_REVIVED,
      undoPayload: stateIdToRemove
    })

    return steps
  }
}

const debounceMs = 100
function continueUpdateState () {
  let debounceTimeoutHandle = -1
  let debounceStateId = ''

  /**
   * Schedule a debounced state updatewhen typing ceased for 100ms.
   */
  return function continueUpdateState ({ dispatch }: StatesContext, diff: StateSpec): void {
    const { id } = diff
    if (debounceTimeoutHandle != -1 && debounceStateId === id) {
      window.clearTimeout(debounceTimeoutHandle)
    }

    debounceTimeoutHandle = window.setTimeout(
      () => {
        debounceTimeoutHandle = -1
        debounceStateId = ''
        updateState()
      },
      debounceMs
    )
    debounceStateId = id

    function updateState() {
      dispatch(UPDATE_STATE, diff)
    }
  }
}

function updateState ({ commit, state: moduleState }: StatesContext, diff: StateSpec): StateSummary {
  if (!('id' in diff)) {
    throw new Error(`Cannot update state, no ID given`)
  }

  for (const existingState of moduleState.states) {
    if (existingState.id === diff.id) {
      const updatedState = {
        ...existingState,
        ...diff
      }

      performReversible(
        commit,
        "Update state",
        {
          mutation: REPLACE_STATE,
          payload: updatedState,
          undoPayload: existingState
        }
      )

      return summarize(updatedState)
    }
  }
  
  throw new Error(`Cannot update state with ID ${diff.id}, not found`)
}

function focusState({ commit }: StatesContext, stateId: string|null): void {
  commit(MUTATION_FOCUS_STATE, stateId)
}

function setInitialState({ state, commit }: StatesContext, stateId: string|null) {
  const previouslyInitial = state.initial
  performReversible(
    commit,
    'Set Initial State',
    {
      mutation: MAKE_INITIAL_STATE,
      payload: stateId,
      undoPayload: previouslyInitial
    }
  )
}
