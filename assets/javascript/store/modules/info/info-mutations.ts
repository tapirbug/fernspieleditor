import {
  SET_PHONEBOOK_TITLE,
  BUMP_ITERATION
} from '../../mutation-types.js'
import { InfoModuleState } from './info-module-state.js'

export const mutations = {
  [SET_PHONEBOOK_TITLE] (info: InfoModuleState, { newTitle }) {
    info.title = newTitle
  },
  [BUMP_ITERATION] (info: InfoModuleState) {
    info.iteration = typeof info.iteration === 'number' ? (info.iteration + 1) : 1
  }
}
