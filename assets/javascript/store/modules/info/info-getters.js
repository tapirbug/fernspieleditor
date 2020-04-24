export default {
  phonebookTitle: (infoState) => infoState.title,
  phonebookAuthor: (infoState) => infoState.author,
  phonebookDescription: (infoState) => infoState.description,
  phonebookIteration: (infoState) => infoState.iteration,
  iteration: (infoState) => infoState.iteration || 0,
  filenameSuggestion: (infoState, getters) =>
    `${snakeCase(infoState.title)}-${infoState.iteration || 0}.phonebook.yaml`
}

function snakeCase (sentence) {
  return sentence.split(' ')
    .map(s => s.toLowerCase())
    .join('_')
}
