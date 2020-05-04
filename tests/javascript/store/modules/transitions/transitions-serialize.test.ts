import {
  serialize
} from '../../../../../assets/javascript/store/modules/transitions/transitions-serialize'
import {
  TransitionType,
  PickUp,
  HangUp,
  End,
  Dial,
  Timeout,
  Transition
} from '../../../../../assets/javascript/store/modules/transitions/transition'

describe('serialize transition summaries', () => {
  const pickUpActive: PickUp = {
    type: TransitionType.PickUp,
    from: 'A',
    to: 'B',
    removed: false
  }
  const pickUpRemoved: PickUp = {
    type: TransitionType.PickUp,
    from: 'A',
    to: 'B',
    removed: true
  }
  const hangUpActive: HangUp = {
    type: TransitionType.HangUp,
    from: 'C',
    to: 'D',
    removed: false
  }
  const hangUpRemoved: HangUp = {
    type: TransitionType.HangUp,
    from: 'C',
    to: 'D',
    removed: true
  }
  const endActive: End = {
    type: TransitionType.End,
    from: 'K',
    to: 'L',
    removed: false
  }
  const endRemoved: End = {
    type: TransitionType.End,
    from: 'K',
    to: 'L',
    removed: true
  }
  const dial0: Dial = {
    type: TransitionType.Dial,
    from: 'Here',
    to: 'There',
    pattern: '0',
    removed: false
  }
  const dial5Active: Dial = {
    type: TransitionType.Dial,
    from: 'Here',
    to: 'There',
    pattern: '5',
    removed: false
  }
  const dial5Removed: Dial = {
    type: TransitionType.Dial,
    from: 'Here',
    to: 'There',
    pattern: '5',
    removed: true
  }
  const timeout: Timeout = {
    type: TransitionType.Timeout,
    after: 5.1,
    from: 'Hereio',
    to: 'Therio',
    removed: false
  }

  describe('serialize in isolation', () => {
    const pickUpSummaries: Transition[] = [pickUpActive, pickUpRemoved]
    const hangUpSummaries: Transition[] = [hangUpActive, hangUpRemoved]
    const endSummaries: Transition[] = [endActive, endRemoved]
    const dialSummaries: Transition[] = [dial0, dial5Active, dial5Removed]

    test('pick up', () => {
      const serialized = serialize(pickUpSummaries)
      expect(serialized).toEqual({
        A: {
          pick_up: 'B'
        }
      })
    })

    test('hang up', () => {
      const serialized = serialize(hangUpSummaries)
      expect(serialized).toEqual({
        C: {
          hang_up: 'D'
        }
      })
    })

    test('end', () => {
      const serialized = serialize(endSummaries)
      expect(serialized).toEqual({
        K: {
          end: 'L'
        }
      })
    })

    test('dial', () => {
      const serialized = serialize(dialSummaries)
      expect(serialized).toEqual({
        Here: {
          dial: {
            0: 'There',
            5: 'There'
          }
        }
      })
    })

    test('timeout', () => {
      const serialized = serialize([timeout])
      expect(serialized).toEqual({
        Hereio: {
          timeout: {
            after: 5.1,
            to: 'Therio'
          }
        }
      })
    })
  })

  describe('serialize mixed types and removed states', () => {
    const mixed = [
      pickUpActive,
      pickUpRemoved,
      hangUpRemoved,
      hangUpActive,
      timeout,
      endActive,
      endRemoved,
      dial0,
      dial5Removed,
      dial5Active
    ]

    test('different origin states', () => {
      const serialized = serialize(mixed)
      expect(serialized).toEqual({
        A: {
          pick_up: 'B'
        },
        C: {
          hang_up: 'D'
        },
        K: {
          end: 'L'
        },
        Here: {
          dial: {
            0: 'There',
            5: 'There'
          }
        },
        Hereio: {
          timeout: {
            after: 5.1,
            to: 'Therio'
          }
        }
      })
    })

    test('same origin state', () => {
      const sameOrigin = mixed.map(summary => { return { ...summary, from: 'same' } })
      const serialized = serialize(sameOrigin)
      expect(serialized).toEqual({
        same: {
          pick_up: 'B',
          hang_up: 'D',
          end: 'L',
          dial: {
            0: 'There',
            5: 'There'
          },
          timeout: {
            after: 5.1,
            to: 'Therio'
          }
        }
      })
    })
  })
})
