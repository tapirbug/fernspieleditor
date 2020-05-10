import {
  getters, TransitionRootGetters
} from '../../../../../assets/javascript/store/modules/transitions/transitions-getters'
import {
  TransitionType,
  PickUpState,
  HangUpState,
  EndState,
  DialState,
  TimeoutState
} from '../../../../../assets/javascript/store/modules/transitions/transition'
import { TransitionModuleState } from 'assets/javascript/store/modules/transitions/transitions-module-state'
const {
  activeTransitions
} = getters

describe('transition getters', () => {
  const pickUpActiveId = 'pickUpActive'
  const pickUpActive: PickUpState = {
    id: pickUpActiveId,
    removed: false,
    type: TransitionType.PickUp,
    from: 'A',
    to: 'B'
  }
  const pickUpFromRemovedStateId = 'pickUpFromRemovedState'
  const pickUpFromRemovedState: PickUpState = {
    id: pickUpFromRemovedStateId,
    removed: false,
    type: TransitionType.PickUp,
    from: 'Removed State',
    to: 'B'
  }
  const hangUpActiveId = 'hangUpActive'
  const hangUpActive: HangUpState = {
    id: hangUpActiveId,
    removed: false,
    type: TransitionType.HangUp,
    from: 'C',
    to: 'D'
  }
  const hangUpFromRemovedStateId = 'hangUpFromRemovedState'
  const hangUpFromRemovedState: HangUpState = {
    id: hangUpFromRemovedStateId,
    removed: false,
    type: TransitionType.HangUp,
    from: 'Removed State',
    to: 'D'
  }
  const endActiveId = 'endActive'
  const endActive: EndState = {
    id: endActiveId,
    removed: false,
    type: TransitionType.End,
    from: 'K',
    to: 'L'
  }
  const endRemovedId = 'endRemoved'
  const endRemoved: EndState = {
    id: endRemovedId,
    removed: true,
    type: TransitionType.End,
    from: 'Removed State',
    to: 'L'
  }
  const dial0Id = 'dial0'
  const dial0: DialState = {
    id: dial0Id,
    removed: false,
    type: TransitionType.Dial,
    from: 'Here',
    to: 'There',
    pattern: '0'
  }
  const dial5ActiveId = 'dial5Active'
  const dial5Active: DialState = {
    id: dial5ActiveId,
    removed: false,
    type: TransitionType.Dial,
    from: 'Here',
    to: 'There',
    pattern: '5'
  }
  const dial5RemovedId = 'dial5Removed'
  const dial5Removed: DialState = {
    id: dial5RemovedId,
    removed: true,
    type: TransitionType.Dial,
    from: 'Removed State',
    to: 'There',
    pattern: '5'
  }
  const timeoutId = 'timeout'
  const timeout: TimeoutState = {
    id: timeoutId,
    removed: false,
    type: TransitionType.Timeout,
    after: 5.1,
    from: 'Hereio',
    to: 'Therio'
  }
  const state: TransitionModuleState = {
    transitions: [
      pickUpActive,
      pickUpFromRemovedState,
      hangUpActive,
      hangUpFromRemovedState,
      endActive,
      endRemoved,
      dial0,
      dial5Active,
      dial5Removed,
      timeout
    ]
  }
  const rootGetters = {
    isRemoved (id) { return id === 'Removed State' },
    isAny (id) { return id === 'any' },
    findState (id) {
      return {
        id,
        name: id,
        description: id,
        sounds: [],
        ring: 0,
        terminal: false,
        position: { x: 0, y: 0 }
      }
    }
  } as TransitionRootGetters // assuming that the other getters are not used

  describe('getting active transitions', () => {
    const active = activeTransitions(state, {}, {}, rootGetters)
    it('contains the transitions that do not involve the removed state and are not removed', () => {
      expect(active).toHaveLength(6)
      expect(active).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: pickUpActiveId }),
          expect.objectContaining({ id: hangUpActiveId }),
          expect.objectContaining({ id: endActiveId }),
          expect.objectContaining({ id: dial0Id }),
          expect.objectContaining({ id: dial5ActiveId }),
          expect.objectContaining({ id: timeoutId })
        ])
      )
    })
    it('does not contain the transitions that involve the removed state', () => {
      expect(active).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ id: pickUpFromRemovedStateId })
        ])
      )
      expect(active).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ id: hangUpFromRemovedStateId })
        ])
      )
    })
    it('does not contain the transitions that are removed', () => {
      expect(active).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ id: endRemovedId })
        ])
      )
      expect(active).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({ id: dial5RemovedId })
        ])
      )
    })
  })
})
