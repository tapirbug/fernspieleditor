// File loading
export const REPLACE_PHONEBOOK = 'REPLACE_PHONEBOOK'

// Undo/redo
export const START_UNDO = 'START_UNDO'
export const FINISH_UNDO = 'FINISH_UNDO'
export const START_REDO = 'START_REDO'
export const CONTRIBUTE_UNDO = 'CONTRIBUTE_UNDO'
export const FINISH_REDO = 'FINISH_REDO'

// Remote control
export const ADD_CONNECTION = 'ADD_CONNECTION'
export const SELECT_CONNECTION = 'SELECT_CONNECTION'
export const ENTER_REMOTE = 'ENTER_REMOTE'
export const RELEASE_SOCKET = 'RELEASE_SOCKET'

// Phonebook Metadata
export const SET_PHONEBOOK_TITLE = 'SET_PHONEBOOK_TITLE'
export const BUMP_ITERATION = 'BUMP_ITERATION'

// State mutations
export const UPDATE_STATE = 'UPDATE_STATE'
export const ADD_STATE = 'ADD_STATE'
export const REMOVE_STATE = 'REMOVE_STATE'
export const MOVE_STATE = 'MOVE_STATE'
export const MAKE_INITIAL_STATE = 'MAKE_INITIAL_STATE'

// Transitions
export const ADD_TRANSITION = 'ADD_TRANSITION'
export const REMOVE_TRANSITION = 'REMOVE_TRANSITION'

// Sound mutations
export const UPDATE_SOUND = 'UPDATE_SOUND'
export const ADD_SOUND = 'ADD_SOUND'

// Change UI state without modifying the phonebook
// that would be generated
export const FOCUS_STATE = 'FOCUS_STATE'
