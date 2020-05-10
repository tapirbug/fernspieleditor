import uuidV4 from '../../../util/random/uuid'
import { Vec2D } from 'assets/javascript/util/geom/vec2d'
import { PhonebookStates } from '../../../phonebook/phonebook-states'
import { PhonebookVendor } from '../../../phonebook/phonebook-vendor'

const defaultName = 'New State'
const defaultPosition: Vec2D = {
  x: 100,
  y: 100
}

export function createState (input: StateSpec): StateState {
  return {
    removed: false,
    id: 'id' in input ? input.id : uuidV4(),
    name: 'name' in input ? input.name : defaultName,
    description: 'description' in input ? input.description : '',
    sounds: 'sounds' in input ? input.sounds : [],
    ring: 'ring' in input ? input.ring : 0,
    terminal: 'terminal' in input ? input.terminal : false,
    position: 'position' in input ? input.position : { ...defaultPosition }
  }
}

export function summarize (state: StateState): StateSummary {
  return {
    ...state
  }
}

export interface StateCommon {
  /**
   * UUID of the state.
   */
  id: string
  name: string
  description: string
  sounds: string[]
  ring: number
  terminal: boolean
  /**
   * Position in the ntwork view.
   *
   * Not part of the core phonebook format, but persisted in
   * the vendor extensions of the phonebook.
   */
  position: Vec2D
}

export interface StateState extends StateCommon {
  /**
   * If `true`, this state is not a tombstone and can be
   * considered active, meaning it should be presented to users.
   *
   * If `false`, this is removed and should not be presented
   * to the user.
   */
  removed: boolean
}

export interface StateSpec {
  id?: string
  name?: string
  description?: string
  sounds?: string[]
  ring?: number
  terminal?: boolean
  position?: Vec2D
}

export type StateSummary = StateCommon

export interface StateSummaryWithRemoved extends StateSummary {
  removed: boolean
}

export interface StateCommon {
  /**
   * UUID of the state.
   */
  id: string
}

/**
 * Just the parts of a phonebook needed to initialize the states module.
 */
export interface PhonebookSubsetForStates {
  states: PhonebookStates
  vendor: PhonebookVendor
  initial: string
}
