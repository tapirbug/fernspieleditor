import {
  SerializeActions,
  serializeActionMapping
} from '../../../../../assets/javascript/store/modules/serialize/serialize-actions'
import Vue from 'vue'
import Vuex, { Store, mapActions } from 'vuex'
import statesModule from '../../../../../assets/javascript/store/modules/states/states-module'
import infoModule from '../../../../../assets/javascript/store/modules/info/info-module'
import transitionsModule from '../../../../../assets/javascript/store/modules/transitions/index'
import serializeModule from '../../../../../assets/javascript/store/modules/serialize/serialize-module'
import soundsModule from '../../../../../assets/javascript/store/modules/sounds/sounds-module'
import undoModule from '../../../../../assets/javascript/store/modules/undo/undo-module'
import { TransitionGetters } from '../../../../../assets/javascript/store/modules/transitions/transitions-getters'
import { StatesGetters } from '../../../../../assets/javascript/store/modules/states/states-getters'
import { StatesActions, statesActionMapping } from '../../../../../assets/javascript/store/modules/states/states-actions'
import { UndoActions, undoActionMapping } from '../../../../../assets/javascript/store/modules/undo/undo-actions'
import { FernspieleditorExtVersion } from '../../../../../assets/javascript/phonebook/phonebook-fernspieleditor-ext'
import { TransitionsActions, transitionActionMapping } from '../../../../../assets/javascript/store/modules/transitions/transitions-actions'
import { TransitionType } from '../../../../../assets/javascript/store/modules/transitions/transition'
import { SoundsActions, soundsActionMapping } from '../../../../../assets/javascript/store/modules/sounds/sounds-actions'

Vue.use(Vuex)

describe('serialize module', () => {
  it('serializes states and transitions to phonebook objects', async () => {
    expect.assertions(3)
    const { actions } = initTestContext()
    const sound = await actions.addSound({ id: 'SoundA', name: 'Sound A', volume: 0.68 })
    await actions.addState({ id: 'FromState', name: 'FromState', sounds: [sound.id] })
    await actions.addState({ id: 'ToState', name: 'ToState' })
    await actions.addTransition({
      type: TransitionType.Timeout,
      after: 5,
      from: 'FromState',
      to: 'ToState'
    })
    await actions.setInitialState('FromState')
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
    await actions.addState({ id: 'FromState', name: 'FromState', sounds: [sound.id] })
    await actions.updateState({
      id: 'FromState',
      position: {
        x: 501,
        y: 602
      }
    })
    await actions.addState({ id: 'ToState', name: 'ToState' })
    await actions.addTransition({
      type: TransitionType.Timeout,
      after: 5,
      from: 'FromState',
      to: 'ToState'
    })
    await actions.setInitialState('FromState')
    await actions.focusState('ToState')
    const yaml = await actions.toYaml()
    expect(yaml).toEqual(expectedYaml)
  })
})

interface TestContext {
  store: Store<object>
  getters: StatesGetters & TransitionGetters
  actions: StatesActions & UndoActions & TransitionsActions & SerializeActions & SoundsActions & { $store: Store<object> }
}

function initTestContext (): TestContext {
  const store = new Vuex.Store<object>({
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
      $store: store,
      ...mapActions({
        ...statesActionMapping,
        ...undoActionMapping,
        ...transitionActionMapping,
        ...soundsActionMapping,
        ...serializeActionMapping
      })
    }
  }
}
