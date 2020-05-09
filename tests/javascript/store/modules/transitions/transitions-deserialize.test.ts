import {
  deserialize
} from '../../../../../assets/javascript/store/modules/transitions/transitions-deserialize'
import { PhonebookTransitions } from '../../../../../assets/javascript/phonebook/phonebook-transitions'
import { TransitionType } from '../../../../../assets/javascript/store/modules/transitions/transition'

describe('deserialization of transitions in phonebooks', () => {
  test('a normal transition map', () => {
    const phonebookTransitions: PhonebookTransitions = {
      any: {
        pick_up: 'State A',
        hang_up: 'State B',
        end: 'State C'
      },
      'State B': {
        timeout: {
          after: 60,
          to: 'State C'
        }
      },
      'State C': {
        timeout: {
          after: 1.5,
          to: 'State C'
        }
      },
      'State A': {
        timeout: {
          after: 5,
          to: 'State A'
        }
      }
    }

    const summaries = deserialize(phonebookTransitions)

    expect(summaries).toHaveLength(6)
    expect(summaries).toEqual(
      expect.arrayContaining([
        expect.objectContaining(
          {
            type: TransitionType.PickUp,
            from: 'any',
            to: 'State A',
            removed: false
          }
        ),
        expect.objectContaining(
          {
            type: TransitionType.HangUp,
            from: 'any',
            to: 'State B',
            removed: false
          }
        ),
        expect.objectContaining(
          {
            type: TransitionType.End,
            from: 'any',
            to: 'State C',
            removed: false
          }
        ),
        expect.objectContaining(
          {
            type: TransitionType.Timeout,
            from: 'State B',
            to: 'State C',
            after: 60,
            removed: false
          }
        ),
        expect.objectContaining(
          {
            type: TransitionType.Timeout,
            from: 'State C',
            to: 'State C',
            after: 1.5,
            removed: false
          }
        ),
        expect.objectContaining(
          {
            type: TransitionType.Timeout,
            from: 'State A',
            to: 'State A',
            after: 5,
            removed: false
          }
        )
      ])
    )
  })
})
