import {
  UPDATE_STATE
} from '../../mutation-types.js'
import {
  CONTINUE_UPDATE_STATE
} from '../../action-types.js'

export default {
  [CONTINUE_UPDATE_STATE]: continueUpdateState()
}

function continueUpdateState () {
  let renamingTimeout = false
  let renamingTimeoutId = ''

  return function continueUpdateState ({ commit }, payload) {
    if (renamingTimeout && renamingTimeoutId === payload.id) {
      window.clearTimeout(renamingTimeout)
    }

    renamingTimeout = window.setTimeout(
      () => commit(UPDATE_STATE, payload),
      100
    )
    renamingTimeoutId = payload.id
  }
}
