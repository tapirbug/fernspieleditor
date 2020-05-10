import { SoundSpec } from './sound-spec'
import uuidV4 from '../../../util/random/uuid'

export interface Sound {
  removed: boolean
  id: string
  name: string
  description: string
  volume: number
  backoff: number
  loop: boolean
  speech: string
  file: string|File
}

export function createSound (spec: SoundSpec): Sound {
  return {
    removed: false,
    id: 'id' in spec ? spec.id : uuidV4(),
    name: 'name' in spec ? spec.name : '',
    description: 'description' in spec ? spec.description : '',
    volume: 'volume' in spec ? spec.volume : 1,
    backoff: 'backoff' in spec ? spec.backoff : 0,
    loop: 'loop' in spec ? spec.loop : false,
    speech: 'speech' in spec ? spec.speech : '',
    file: 'file' in spec ? spec.file : ''
  }
}
