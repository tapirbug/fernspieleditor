/// Tests the states module together with transitions and undo
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import states from '../../../../../assets/javascript/store/modules/states/index'
import transitions from '../../../../../assets/javascript/store/modules/transitions/index'
import undo from '../../../../../assets/javascript/store/modules/undo/index'
import {
  ADD_STATE,
  REMOVE_STATE,
  CONTINUE_UPDATE_STATE,
  UPDATE_STATE,
  UNDO,
  REDO,
  FOCUS_STATE,
  SET_INITIAL_STATE
} from '../../../../../assets/javascript/store/action-types'
import { TransitionGetters } from '../../../../../assets/javascript/store/modules/transitions/transitions-getters'
import { StatesGetters } from '../../../../../assets/javascript/store/modules/states/states-getters'
import { StatesActions } from 'assets/javascript/store/modules/states/states-actions'
import { StateSpec, StateSummary } from 'assets/javascript/store/modules/states/state'
import { UndoActions } from 'assets/javascript/store/modules/undo/undo-actions'
import { FernspieleditorExtVersion } from 'assets/javascript/phonebook/phonebook-fernspieleditor-ext'

Vue.use(Vuex)

describe('states module', () => {
  it('initially contains only the any state', () => {
    const { getters } = initStore()
    expect(getters.states).toHaveLength(1)
    expect(getters.states).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'any'
        })
      ])
    )
  })

  it('throws when trying to remove the any state', () => {
    const { actions } = initStore()
    expect(() => actions.removeState('any')).toThrow()
  })

  it('throws removing unknown ID', () => {
    const { actions } = initStore()
    expect(() => actions.removeState('holodrio')).toThrow()
  })

  describe('add state', () => {
    it('returns summary from getters after adding', async () => {
      expect.assertions(4)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )

      const { states, initial, focusedStateId } = getters
      expect(initial).toBeNull()
      expect(focusedStateId).toBeNull()
      expect(states).toHaveLength(2)
      expect(states).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: 'any'
        }),
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })

  describe('add and focus state', () => {
    it('returns summary from getters after adding', async () => {
      expect.assertions(4)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )
      actions.focusState(summaryFromAdding.id)
      actions.setInitialState(summaryFromAdding.id)

      const { states, initial, focusedStateId } = getters
      expect(initial).toEqual(summaryFromAdding.id)
      expect(focusedStateId).toEqual(summaryFromAdding.id)
      expect(states).toHaveLength(2)
      expect(states).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: 'any'
        }),
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })

  describe('add state and undo adding', () => {
    it('excludes summary from getters after undoing the add', async () => {
      expect.assertions(2)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )
      actions.undo()

      expect(getters.states).toHaveLength(1)
      expect(getters.states).toEqual(expect.not.arrayContaining([
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })

  describe('add state and undo then redo', () => {
    it('returns summary from getters after adding, undoing, redoing', async () => {
      expect.assertions(2)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )
      actions.undo()
      actions.redo()

      expect(getters.states).toHaveLength(2) // any + added state = 2
      expect(getters.states).toEqual(expect.arrayContaining([
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })

  describe('add state and undo then redo', () => {
    it('returns summary from getters after adding, undoing, redoing', async () => {
      expect.assertions(2)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )
      actions.undo()
      actions.redo()

      expect(getters.states).toHaveLength(2) // any + added state = 2
      expect(getters.states).toEqual(expect.arrayContaining([
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })

  describe('remove state', () => {
    it('excludes summary in getters after removal', async () => {
      expect.assertions(2)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )
      actions.removeState(summaryFromAdding.id)

      expect(getters.states).toHaveLength(1)
      expect(getters.states).toEqual(expect.not.arrayContaining([
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })

  describe('remove state and then undo', () => {
    it('includes summary in getters after undoing removal', async () => {
      expect.assertions(4)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )
      actions.removeState(summaryFromAdding.id)
      actions.undo()

      const { states, initial, focusedStateId } = getters
      expect(initial).toBeNull()
      expect(focusedStateId).toBeNull()
      expect(states).toHaveLength(2)
      expect(states).toEqual(expect.arrayContaining([
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })

  describe('make state intial, focus it, remove state, undo, and then redo', () => {
    it('includes summary in getters after undoing removal', async () => {
      expect.assertions(8)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )
      actions.focusState(summaryFromAdding.id) // focus should be restored after redo
      actions.setInitialState(summaryFromAdding.id)
      actions.removeState(summaryFromAdding.id)

      const {
        states: statesBeforeUndo,
        initial: initialBeforeUndo,
        focusedStateId: focusedStateIdBeforeUndo
      } = getters
      actions.undo()
      const {
        states: statesAfterUndo,
        initial: initialAfterUndo,
        focusedStateId: focusedStateIdAfterUndo
      } = getters

      expect(initialBeforeUndo).toBeNull()
      expect(focusedStateIdBeforeUndo).toBeNull()
      expect(statesBeforeUndo).toHaveLength(1)
      expect(statesBeforeUndo).toEqual(expect.not.arrayContaining([
        expect.objectContaining(summaryFromAdding)
      ]))

      expect(initialAfterUndo).toEqual(summaryFromAdding.id)
      expect(focusedStateIdAfterUndo).toEqual(summaryFromAdding.id)
      expect(statesAfterUndo).toHaveLength(2)
      expect(statesAfterUndo).toEqual(expect.arrayContaining([
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })

  describe('remove state and then undo and then redo', () => {
    it('includes summary in getters after undoing removal', async () => {
      expect.assertions(2)
      const { getters, actions } = initStore()
      const summaryFromAdding = await actions.addState(
        {
          name: 'Fabulous State',
          description: 'What a wonderful day to be a state.'
        }
      )
      actions.removeState(summaryFromAdding.id)
      actions.undo()
      actions.redo()

      expect(getters.states).toHaveLength(1)
      expect(getters.states).toEqual(expect.not.arrayContaining([
        expect.objectContaining(summaryFromAdding)
      ]))
    })
  })
})

interface TestContext {
  store: Store<any>
  getters: StatesGetters & TransitionGetters
  actions: StatesActions & UndoActions
}

function initStore(): TestContext {
  const store = new Vuex.Store({
    modules: {
      states: states({
        initial: null,
        states: {},
        vendor: {
          fernspieleditor: {
            version: FernspieleditorExtVersion.Version1,
            focusedStateId: null,
            extensionProperties: {
              states: {}
            }
          }
        }
      }),
      transitions: transitions({}),
      undo: undo()
    }
  })
  const getters : StatesGetters & TransitionGetters = store.getters
  return {
    store,
    getters,
    actions: {
      addState(spec: StateSpec): Promise<StateSummary> {
        return store.dispatch(ADD_STATE, spec)
      },
      removeState(stateId: string): void {
        store.dispatch(REMOVE_STATE, stateId)
      },
      continueUpdateState(spec: StateSpec): void {
        store.dispatch(CONTINUE_UPDATE_STATE, spec)
      },
      updateState(spec: StateSpec): Promise<StateSummary> {
        return store.dispatch(UPDATE_STATE, spec)
      },
      focusState(id: string): void {
        store.dispatch(FOCUS_STATE, id)
      },
      setInitialState(id: string): void {
        store.dispatch(SET_INITIAL_STATE, id)
      },
      undo() {
        store.dispatch(UNDO)
      },
      redo() {
        store.dispatch(REDO)
      }
    }
  }
}
