export default {
  phonebookTitle: (infoState) => infoState.title,
  phonebookAuthor: (infoState) => infoState.author,
  phonebookDescription: (infoState) => infoState.description,
  filenameSuggestion: (infoState) => `${snakeCase(infoState.title)}.phonebook.yaml`
}

function snakeCase (sentence) {
  return sentence.split(' ')
    .map(s => s.toLowerCase())
    .join('_')
}
