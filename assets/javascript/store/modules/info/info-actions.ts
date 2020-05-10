import {
  UPDATE_INFO,
  BUMP_ITERATION
} from '../../action-types.js'
import {
  SET_INFO
} from '../../mutation-types.js'
import { ActionContext } from 'vuex'
import { InfoModuleState } from './info-module-state'
import { InfoSpec } from './info-spec'
import { Info } from './info.js'
import performReversible from '../undo/undo-reversible'

export interface InfoActions {
  updateInfo(changedProperties: InfoSpec): void
  bumpIteration(): void
}

export const actions = {
  [UPDATE_INFO]: updateInfo,
  [BUMP_ITERATION]: bumpIteration
}

export const infoActionMapping = {
  updateInfo: UPDATE_INFO,
  bumpIteration: BUMP_ITERATION 
}

interface InfoContext extends ActionContext<InfoModuleState, any> {
}

function updateInfo ({ commit, state: { info: oldInfo } }: InfoContext, diff: InfoSpec): void {
  const updated : Info = {
    ...oldInfo,
    ...diff
  }
  performReversible(
    commit,
    'Update Phonebook Metadata',
    {
      mutation: SET_INFO,
      payload: updated,
      undoPayload: oldInfo
    }
  )
}

function bumpIteration ({ dispatch, state: { info: { iteration } } }: InfoContext): void {
  const bumpedSpec : InfoSpec = { iteration: iteration + 1 }
  dispatch(UPDATE_INFO, bumpedSpec) // iteration is intentionally not reversible
}
