import {
  SET_INFO
} from '../../mutation-types.js'
import { InfoModuleState } from './info-module-state.js'
import { Info } from './info.js'

export const mutations = {
  [SET_INFO] (moduleState: InfoModuleState, newInfo: Info) {
    moduleState.info = newInfo
  }
}
