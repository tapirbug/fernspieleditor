import {
  deserialize
} from '../../../../../assets/javascript/store/modules/states/states-deserialize'
import { PhonebookSubsetForStates, createState } from '../../../../../assets/javascript/store/modules/states/state'
import { PhonebookStates } from '../../../../../assets/javascript/phonebook/phonebook-states'
import { FernspieleditorExtVersion, PhonebookFernspieleditorStatesExt } from '../../../../../assets/javascript/phonebook/phonebook-fernspieleditor-ext'

describe('deserialize the state parts of a phonebook', () => {
  const stateId = 'State A'
  const name = stateId
  const description = stateId
  const sounds = [ 'Sound A' ]
  const ring = 0.1
  const terminal = false
  const position = {
    x: 101,
    y: 304
  }
  const initial = stateId
  const focused = stateId
  const stateState = createState({
    id: stateId,
    name,
    description,
    sounds,
    ring,
    terminal,
    position
  })
  const phonebook = initPhonebook({
    initial,
    focused,
    states: {
      [stateId]: {
        name,
        description,
        sounds,
        ring,
        terminal
      }
    },
    statesExt: {
      [stateId]: {
        network: {
          position
        }
      }
    }
  })

  it('properly deserializes all known properties', () => {
    const {
      initial: deserializedInitial,
      states: deserializedStates,
      focusedStateId: deserializedFocused
    } = deserialize(phonebook)

    expect(deserializedInitial).toEqual(initial)
    expect(deserializedFocused).toEqual(focused)
    expect(deserializedStates).toEqual(
      expect.arrayContaining([
        expect.objectContaining(stateState)
      ])
    )
  })
})

interface PhonebookTestInit {
  initial: string,
  focused: string,
  states: PhonebookStates,
  statesExt: PhonebookFernspieleditorStatesExt
}

function initPhonebook({ initial, focused, states, statesExt }: PhonebookTestInit): PhonebookSubsetForStates {
  return {
    initial,
    states: states,
    vendor: {
      fernspieleditor: {
        version: FernspieleditorExtVersion.Version1,
        focusedStateId: focused,
        extensionProperties: {
          states: statesExt
        }
      }
    }
  }
}