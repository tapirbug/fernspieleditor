// File loading
export const REPLACE_PHONEBOOK = 'REPLACE_PHONEBOOK'

// Undo/redo
export const START_UNDO = 'START_UNDO'
export const FINISH_UNDO = 'FINISH_UNDO'
export const DO = 'DO'
export const DONE = 'DONE'
export const START_REDO = 'START_REDO'
export const CONTRIBUTE_UNDO = 'CONTRIBUTE_UNDO'
export const FINISH_REDO = 'FINISH_REDO'

// Remote control
export const ADD_CONNECTION = 'ADD_CONNECTION'
export const SELECT_CONNECTION = 'SELECT_CONNECTION'
export const ENTER_REMOTE = 'ENTER_REMOTE'
export const RELEASE_SOCKET = 'RELEASE_SOCKET'

// Phonebook Metadata
export const SET_INFO = 'SET_INFO'

// State mutations
export const PUSH_STATE = 'PUSH_STATE'
export const SET_STATE_REMOVED = 'SET_STATE_REMOVED'
export const SET_STATE_REVIVED = 'SET_STATE_REVIVED'
export const REPLACE_STATE = 'REPLACE_STATE'
export const MOVE_STATE = 'MOVE_STATE'
export const MAKE_INITIAL_STATE = 'MAKE_INITIAL_STATE'

// Transitions
export const PUSH_TRANSITION = 'PUSH_TRANSITION'
export const SET_TRANSITION_REMOVED = 'SET_TRANSITION_REMOVED'
export const SET_TRANSITION_REVIVED = 'SET_TRANSITION_REVIVED'

// Sound mutations
export const UPDATE_SOUND = 'UPDATE_SOUND'
export const ADD_SOUND = 'ADD_SOUND'

// Change UI state without modifying the phonebook
// that would be generated
export const FOCUS_STATE = 'FOCUS_STATE'
