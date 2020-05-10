import { InfoModuleState } from './info-module-state'
import { PhonebookSubsetForInfo } from './info-deserialize'

export function serializeInfo (state: InfoModuleState): PhonebookSubsetForInfo {
  return {
    info: { ...state.info }
  }
}
