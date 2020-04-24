import {
  SET_PHONEBOOK_TITLE,
  BUMP_ITERATION
} from '../../mutation-types.js'

export default {
  [SET_PHONEBOOK_TITLE] (info, { newTitle }) {
    info.title = newTitle
  },
  [BUMP_ITERATION] (info) {
    info.iteration = typeof info.iteration === 'number' ? (info.iteration + 1) : 1
  }
}
