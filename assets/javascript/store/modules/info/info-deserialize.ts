import {
  PhonebookInfo
} from '../../../phonebook/phonebook-info'
import { InfoModuleState } from './info-module-state'

export interface PhonebookSubsetForInfo {
  info: PhonebookInfo
}

export function deserializeInfo (phonebook: PhonebookSubsetForInfo): InfoModuleState {
  return {
    info: {
      title: phonebook.info.title,
      author: phonebook.info.author,
      description: phonebook.info.description,
      iteration: phonebook.info.iteration
    }
  }
}
