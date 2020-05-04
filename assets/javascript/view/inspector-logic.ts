import { CONTINUE_UPDATE_STATE } from '../store/action-types.js'
import { REMOVE_STATE, MAKE_INITIAL_STATE } from '../store/mutation-types.js'
import { REMOVE_TRANSITION } from '../store/action-types.js'
import { mapGetters, mapActions, mapMutations } from 'vuex'

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
    'focusedStateId',
    'focusedState',
    'hasFocusedState',
    'isAny',
    'transitionSummariesWith',
    'initial',
    'isInitial'
  ]),
  nothingFocused () {
    return !this.hasFocusedState
  }
};

export const methods = {
  ...mapMutations([REMOVE_STATE, MAKE_INITIAL_STATE]),
  ...mapActions({
    removeTransition: REMOVE_TRANSITION,
    continueUpdateState: CONTINUE_UPDATE_STATE
  }),
  change (evtOrNewValue, id, prop) {
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
        change: {
          [prop]: value
        },
        changeBack: {
          [prop]: prevValue
        }
      })
    }
  },
  removeState () {
    this[REMOVE_STATE]({
      id: this.focusedStateId,
      wasInitial: this.isInitial(this.focusedStateId)
    })
  },
  toggleActiveClass (when) {
    return {
      'is-active': !!when,
      'is-inactive': !when
    }
  },
  setInitial (evt) {
    this[MAKE_INITIAL_STATE](
      {
        change: evt.target.checked
          ? this.focusedStateId
          : null,
        changeBack: this.initial
      }
    )
  }
}
