import { MAKE_INITIAL_STATE } from '../store/mutation-types'
import { REMOVE_TRANSITION } from '../store/action-types'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { statesGetterMappings, StatesGetters } from '../store/modules/states/states-getters'
import { statesActionMapping, StatesActions } from '../store/modules/states/states-actions'

interface Inspector extends StatesActions, StatesGetters {}

/**
 * Editor for the currently focused element.
 */
export function data () {
  return {
    addingTransition: false
  }
}

export const computed = {
  ...mapGetters([
    ...statesGetterMappings,
    'hasFocusedState',
    'transitionSummariesWith',
    'initial',
    'isInitial'
  ]),
  nothingFocused () {
    return !this.hasFocusedState
  }
}

export const methods = {
  ...mapMutations([MAKE_INITIAL_STATE]),
  ...mapActions({
    removeTransition: REMOVE_TRANSITION,
    ...statesActionMapping
  }),
  change (this: Inspector, evtOrNewValue, id, prop) {
    let value = (() => {
      if (typeof evtOrNewValue !== 'object') {
        // Scalar has been passed directly
        return evtOrNewValue
      } else if (typeof evtOrNewValue.target !== 'undefined') {
        // Was a real event, pluck the data out of it
        const target = evtOrNewValue.target
        if (target.type === 'checkbox') {
          // A checkbox or similar
          return !!target.checked
        } else {
          return target.value
        }
      } else {
        // Some other object, set as the new value directly
        return evtOrNewValue
      }
    })()

    if (prop === 'ring') {
      value = parseFloat(value)
    }

    const prevValue = this.focusedState[prop]

    if (value !== prevValue) {
      this.continueUpdateState({
        id,
        [prop]: value
      })
    }
  },
  toggleActiveClass (when) {
    return {
      'is-active': !!when,
      'is-inactive': !when
    }
  },
  setInitial (this: Inspector, evt) {
    this.setInitialState(
      evt.target.checked
          ? this.focusedStateId
          : null
    )
  }
}
