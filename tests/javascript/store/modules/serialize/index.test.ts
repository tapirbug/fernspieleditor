import {
  SerializeActions
} from '../../../../../assets/javascript/store/modules/serialize/serialize-actions'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import statesModule from '../../../../../assets/javascript/store/modules/states/states-module'
import infoModule from '../../../../../assets/javascript/store/modules/info/info-module'
import transitionsModule from '../../../../../assets/javascript/store/modules/transitions/index'
import serializeModule from '../../../../../assets/javascript/store/modules/serialize/serialize-module'
import soundsModule from '../../../../../assets/javascript/store/modules/sounds/sounds-module'
import undoModule from '../../../../../assets/javascript/store/modules/undo/undo-module'
import {
  ADD_STATE,
  REMOVE_STATE,
  CONTINUE_UPDATE_STATE,
  UPDATE_STATE,
  UNDO,
  REDO,
  FOCUS_STATE,
  SET_INITIAL_STATE,
  ADD_TRANSITION,
  REMOVE_TRANSITION,
  SERIALIZE,
  TO_YAML,
  ADD_SOUND,
  REMOVE_SOUND,
  UPDATE_SOUND,
  SERIALIZE_SOUNDS
} from '../../../../../assets/javascript/store/action-types'
import { TransitionGetters } from '../../../../../assets/javascript/store/modules/transitions/transitions-getters'
import { StatesGetters } from '../../../../../assets/javascript/store/modules/states/states-getters'
import { StatesActions } from 'assets/javascript/store/modules/states/states-actions'
import { StateSpec, StateSummary } from 'assets/javascript/store/modules/states/state'
import { UndoActions } from 'assets/javascript/store/modules/undo/undo-actions'
import { FernspieleditorExtVersion } from 'assets/javascript/phonebook/phonebook-fernspieleditor-ext'
import { TransitionsActions } from 'assets/javascript/store/modules/transitions/transitions-actions'
import { TransitionSpec, TransitionType } from 'assets/javascript/store/modules/transitions/transition'
import { SoundsActions } from 'assets/javascript/store/modules/sounds/sounds-actions'
import { SoundSpec } from 'assets/javascript/store/modules/sounds/sound-spec'
import { PhonebookSubsetForSounds } from 'assets/javascript/store/modules/sounds/sounds-phonebook-subset'

Vue.use(Vuex)

describe('serialize module', () => {
  it('serializes states and transitions to phonebook objects', async () => {
    expect.assertions(3)
    const { actions } = initTestContext()
    const sound = await actions.addSound({ id: 'SoundA', name: 'Sound A', volume: 0.68 })
    actions.addState({ id: 'FromState', name: 'FromState', sounds: [sound.id] })
    actions.addState({ id: 'ToState', name: 'ToState' })
    actions.addTransition({
      type: TransitionType.Timeout,
      after: 5,
      from: 'FromState',
      to: 'ToState'
    })
    actions.setInitialState('FromState')
    const { states, transitions } = await actions.serialize()
    expect(Object.keys(states)).toEqual(
      expect.arrayContaining(['FromState', 'ToState'])
    )
    expect(transitions.FromState.timeout.after).toEqual(5)
    expect(transitions.FromState.timeout.to).toEqual('ToState')
  })

  it('serializes states and transitions to YAML', async () => {
    expect.assertions(1)
    const expectedYaml = `info:
  title: Sauerteig
  author: Heinz Elbert
  description: desc
  iteration: 42
sounds:
  SoundA:
    name: Sound A
    description: ""
    volume: 0.68
    backoff: 0.2
    loop: false
    speech: ""
    file: ""
initial: FromState
states:
  FromState:
    name: FromState
    description: ""
    terminal: false
    sounds:
      - SoundA
    ring: 0
  ToState:
    name: ToState
    description: ""
    terminal: false
    sounds: []
    ring: 0
transitions:
  FromState:
    timeout:
      after: 5
      to: ToState
vendor:
  fernspieleditor:
    version: 1
    focusedStateId: ToState
    extensionProperties:
      states:
        FromState:
          network:
            position:
              x: 501
              y: 602
        ToState:
          network:
            position:
              x: 100
              y: 100
`
    const { actions } = initTestContext()
    const sound = await actions.addSound({ id: 'SoundA', name: 'Sound A', volume: 0.68 })
    actions.addState({ id: 'FromState', name: 'FromState', sounds: [sound.id] })
    actions.updateState({
      id: 'FromState',
      position: {
        x: 501,
        y: 602
      }
    })
    actions.addState({ id: 'ToState', name: 'ToState' })
    actions.addTransition({
      type: TransitionType.Timeout,
      after: 5,
      from: 'FromState',
      to: 'ToState'
    })
    actions.setInitialState('FromState')
    actions.focusState('ToState')
    const yaml = await actions.toYaml()
    expect(yaml).toEqual(expectedYaml)
  })
})

interface TestContext {
  store: Store<any>
  getters: StatesGetters & TransitionGetters
  actions: StatesActions & UndoActions & TransitionsActions & SerializeActions & SoundsActions
}

function initTestContext (): TestContext {
  const store = new Vuex.Store({
    modules: {
      info: infoModule({
        info: {
          title: 'Sauerteig',
          author: 'Heinz Elbert',
          description: 'desc',
          iteration: 42
        }
      }),
      states: statesModule({
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
      transitions: transitionsModule({}),
      undo: undoModule(),
      serialize: serializeModule(),
      sounds: soundsModule({
        sounds: {}
      })
    }
  })
  const getters: StatesGetters & TransitionGetters = store.getters
  return {
    store,
    getters,
    actions: {
      addState (spec: StateSpec): Promise<StateSummary> {
        return store.dispatch(ADD_STATE, spec)
      },
      removeState (stateId: string): void {
        store.dispatch(REMOVE_STATE, stateId)
      },
      continueUpdateState (spec: StateSpec): void {
        store.dispatch(CONTINUE_UPDATE_STATE, spec)
      },
      updateState (spec: StateSpec): Promise<StateSummary> {
        return store.dispatch(UPDATE_STATE, spec)
      },
      focusState (id: string): void {
        store.dispatch(FOCUS_STATE, id)
      },
      setInitialState (id: string): void {
        store.dispatch(SET_INITIAL_STATE, id)
      },
      undo () {
        store.dispatch(UNDO)
      },
      redo () {
        store.dispatch(REDO)
      },
      addTransition (spec: TransitionSpec) {
        return store.dispatch(ADD_TRANSITION, spec)
      },
      removeTransition (transitionId: string) {
        store.dispatch(REMOVE_TRANSITION, transitionId)
      },
      serialize () {
        return store.dispatch(SERIALIZE)
      },
      toYaml () {
        return store.dispatch(TO_YAML)
      },
      addSound (spec: SoundSpec) {
        return store.dispatch(ADD_SOUND, spec)
      },
      removeSound (id: string) {
        store.dispatch(REMOVE_SOUND, id)
      },
      updateSound (updated: SoundSpec) {
        store.dispatch(UPDATE_SOUND, updated)
      },
      serializeSounds (): Promise<PhonebookSubsetForSounds> {
        return store.dispatch(SERIALIZE_SOUNDS)
      }
    }
  }
}
