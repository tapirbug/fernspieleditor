import Vue from 'vue'
import { defaultSound } from '../../../phonebook/phonebook-sound'
import uuid from '../../../util/random/uuid.js'
import { toStr, toBool, toFiniteFloat } from '../../../util/conv.js'
import {
  ADD_SOUND,
  UPDATE_SOUND,
  REPLACE_PHONEBOOK
} from '../../mutation-types.js'

export default {
  [UPDATE_SOUND] (sounds, { id, ...updatedProps }) {
    Vue.set(
      sounds,
      id,
      sanitizeSound({
        ...(sounds[id] || defaultSound()),
        ...updatedProps
      })
    )
  },
  [ADD_SOUND] (sounds, newSound) {
    const id = uuid()
    newSound = {
      ...defaultSound(),
      ...sanitizeSound(newSound)
    }
    Vue.set(sounds, id, newSound)
  },
  [REPLACE_PHONEBOOK] (sounds, phonebook) {
    // clear existing sounds
    Object.keys(sounds)
      .forEach(key => Vue.delete(sounds, key))

    // and set the new ones
    if (typeof phonebook === 'object' && typeof phonebook.sounds === 'object') {
      Object.entries(phonebook.sounds)
        .forEach(([id, sound]) => Vue.set(sounds, id, sound))
    }
  }
}

function sanitizeSound (sound) {
  const sanitized = {
    // Make sure props have expected types
    name: toStr(sound.name),
    loop: toBool(sound.loop),
    speech: toStr(sound.speech),
    volume: toFiniteFloat(sound.volume),
    backoff: toFiniteFloat(sound.backoff)
    // any additional properties from the parameter are left out
  }

  if (typeof sound.file === 'string' && sound.file !== '') {
    // A file can be cleared by setting it to the empty string,
    // only set non-empty paths and data-URIs
    sanitized.file = sound.file
  } else if (typeof sound.file === 'object' && sound.file !== null) {
    // File objects are fine too
    sanitized.file = sound.file
  }

  return sanitized
}
