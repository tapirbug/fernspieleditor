import {
  SET_PHONEBOOK_TITLE
} from '../../mutation-types.js'

export default {
  [SET_PHONEBOOK_TITLE] (info, newTitle) {
    info.title = newTitle
  }
}
