import {
  SET_INFO
} from '../../mutation-types'
import { InfoModuleState } from './info-module-state'
import { Info } from './info'

export const mutations = {
  [SET_INFO] (moduleState: InfoModuleState, newInfo: Info) {
    moduleState.info = newInfo
  }
}
