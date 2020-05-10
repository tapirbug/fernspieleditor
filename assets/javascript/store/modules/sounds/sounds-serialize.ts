import { SoundsModuleState } from "./sounds-module-state";
import { PhonebookSubsetForSounds } from "./sounds-phonebook-subset";
import { PhonebookSounds } from "../../../phonebook/phonebook-sound";
import { toDataURL } from '../../../util/file/read.js'

export async function serializeSounds(state: SoundsModuleState): Promise<PhonebookSubsetForSounds> {
  const sounds : PhonebookSounds = {}
  for (const { removed, id, name, description, volume, backoff, loop, speech, file } of state.sounds) {
    if (!removed) {
      sounds[id] = {
        name,
        description,
        volume,
        backoff,
        loop,
        speech,
        file: typeof file === 'string' ? file : await toDataURL(file)
      }
    }
  }
  return { sounds }
}
