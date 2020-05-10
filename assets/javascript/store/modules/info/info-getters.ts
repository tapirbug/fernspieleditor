import { InfoModuleState } from "./info-module-state"

export const getters = {
  phonebookTitle: (infoState: InfoModuleState) => infoState.title,
  phonebookAuthor: (infoState: InfoModuleState) => infoState.author,
  phonebookDescription: (infoState: InfoModuleState) => infoState.description,
  iteration: (infoState: InfoModuleState) => infoState.iteration || 0,
  filenameSuggestion: (infoState: InfoModuleState) =>
    `${snakeCase(infoState.title)}-${infoState.iteration || 0}.phonebook.yaml`
}

export interface InfoGetters {
  readonly phonebookTitle: string
  readonly phonebookAuthor: string
  readonly phonebookDescription: string
  readonly iteration: number
  readonly filenameSuggestion: string
}

function snakeCase (sentence: string): string {
  return sentence.split(' ')
    .map(s => s.toLowerCase())
    .join('_')
}
