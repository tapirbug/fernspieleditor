import { PhonebookSounds } from './phonebook-sound'
import { PhonebookStates } from './phonebook-states'
import { PhonebookTransitions } from './phonebook-transitions'
import { PhonebookVendor } from './phonebook-vendor'
import { PhonebookInfo } from './phonebook-info'

export interface Phonebook {
  info: PhonebookInfo
  initial: string
  states: PhonebookStates
  sounds: PhonebookSounds
  transitions: PhonebookTransitions
  vendor: PhonebookVendor
}
