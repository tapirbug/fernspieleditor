import { SoundsModuleState } from "./sounds-module-state";
import { PhonebookSubsetForSounds } from "./sounds-phonebook-subset";

export function deserializeSounds(phonebook: PhonebookSubsetForSounds): SoundsModuleState {
  return {
    sounds: Object.entries(phonebook.sounds).reduce(
      (acc, [ id, soundProps ]) => {
        acc.push({ id, ...soundProps })
        return acc
      },
      []
    )
  }
}
