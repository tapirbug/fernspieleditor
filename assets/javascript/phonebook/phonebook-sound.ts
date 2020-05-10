export interface PhonebookSound {
  name: string
  description: string
  volume: number
  backoff: number
  loop: boolean
  speech: string,
  file: string
}

export interface PhonebookSounds {
  [soundIdsAgainstSounds: string]: PhonebookSound
}

/**
 * A newly added, blank sound
 */
export function defaultSound (): PhonebookSound {
  return {
    name: 'New Sound',
    description: '',
    volume: 0.9,
    backoff: 0.2,
    loop: false,
    file: '',
    speech: ''
  }
}
