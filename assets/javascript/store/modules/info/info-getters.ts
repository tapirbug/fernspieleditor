import { InfoModuleState } from "./info-module-state"
import { PhonebookSubsetForInfo } from "./info-deserialize"
import { serializeInfo } from "./info-serialize"

export const getters = {
  phonebookTitle: ({ info: { title } }: InfoModuleState) => title,
  phonebookAuthor: ({ info: { author } }: InfoModuleState) => author,
  phonebookDescription: ({ info: { description } }: InfoModuleState) => description,
  iteration: ({ info: { iteration } }: InfoModuleState) => iteration,
  filenameSuggestion: ({ info: { title, iteration } }: InfoModuleState) =>
    `${snakeCase(title)}-${iteration}.phonebook.yaml`,
  phonebookSubsetForInfo: (state: InfoModuleState) => serializeInfo(state)
}

export interface InfoGetters {
  readonly phonebookTitle: string
  readonly phonebookAuthor: string
  readonly phonebookDescription: string
  readonly iteration: number
  readonly filenameSuggestion: string
  readonly phonebookSubsetForInfo: PhonebookSubsetForInfo
}

function snakeCase (sentence: string): string {
  return sentence.split(' ')
    .map(s => s.toLowerCase())
    .join('_')
}
