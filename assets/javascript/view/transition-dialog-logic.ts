import { mapActions, mapGetters } from 'vuex'
import { ADD_TRANSITION } from '../store/action-types'
import { TransitionSpec, TransitionType } from '../store/modules/transitions/transition'

interface Data {
  done: boolean
  transitionTargetId: string | null
  transitionType: TransitionType | null
  dialNumber: string | null
  timeoutSeconds: string | null,
  /**
   * Transition types mapped against human-readable
   * names for the types.
   */
  allTransitionTypes: {[type: string]: string}
}

interface Props {
  /**
   * Source state, set from a property on the directive.
   */
  from: string
}

type Self = Data & Props

export const props = {
  from: {
    type: String,
    required: true
  }
}

const allTransitionTypes = {
  dial: 'Dial',
  timeout: 'Timeout',
  pick_up: 'Pick up',
  hang_up: 'Hang up'
}

/**
 * A floating dialog over a state to add transitions.
 */
export function data () : Data {
  return {
    done: false,
    transitionTargetId: null,
    transitionType: null,
    dialNumber: null,
    timeoutSeconds: null,
    allTransitionTypes
  }
}

export const computed = {
  ...mapGetters(['states'])
}
 
export const methods = {
  ...mapActions({
    'addTransition': ADD_TRANSITION 
  }),
  selectTransitionTarget (id) {
    this.transitionTargetId = id
  },
  currentTransitionSpec () : TransitionSpec | null {
    return currentTransitionSpec(this)
  },
  updateTransitionIfComplete (otherwiseFocusSel) {
    this.$nextTick(() => {
      const config : TransitionSpec | null = this.currentTransitionSpec()

      if (config === null) {
        this.$el.querySelector(otherwiseFocusSel).click()
      } else {
        this.addTransition(config)
        this.$emit('addtransitiondone', config)
      }
    })
  }
}

function currentTransitionSpec(data: Self): TransitionSpec | null {
  const transitionType = data.transitionType
  const from = data.from
  const to = data.transitionTargetId

  if (transitionType === null || from === null || to === null) {
    return null
  }

  switch (transitionType) {
    case TransitionType.Dial:
      const pattern = data.dialNumber
      if (pattern === null) {
        return null
      }

      const num = parseInt(data.dialNumber)
      if (num < 0 || num > 9 || isNaN(num)) {
        // only numbers 0 through 9 are currently accepted as patterns
        return null
      }

      return {
        type: TransitionType.Dial,
        from,
        to,
        pattern
      }

    case TransitionType.Timeout:
      const afterStr = data.timeoutSeconds
      if (afterStr === null) {
        return null
      }      

      const after = parseFloat(afterStr)
      if (isNaN(after)) {
        return null
      }

      return {
        type: TransitionType.Timeout,
        after,
        from,
        to
      }

    case TransitionType.PickUp:
    case TransitionType.HangUp:
    case TransitionType.End:
      return {
        type: transitionType,
        from,
        to
      }

    
    default:
      throw new Error(`Unhandled transition type: ${transitionType}`)

  }
}
