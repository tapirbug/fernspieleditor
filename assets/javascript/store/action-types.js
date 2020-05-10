/// Load/save files
export const LOAD_FILE = 'LOAD_FILE'
export const SERIALIZE = 'SERIALIZE'
export const TO_YAML = 'TO_YAML'

// Undo/redo
export const UNDO = 'UNDO'
export const REDO = 'REDO'

// Update phonebook info (author, title, increment iteration, etc.)
export const UPDATE_INFO = 'UPDATE_INFO'
export const BUMP_ITERATION = 'BUMP_ITERATION'

/// Connect/deploy
export const CONNECT = 'CONNECT'
export const DISCONNECT = 'DISCONNECT'
export const DEPLOY = 'DEPLOY'

// Add/remove states
export const ADD_STATE = 'ADD_STATE'
export const REMOVE_STATE = 'REMOVE_STATE'
export const UPDATE_STATE = 'UPDATE_STATE'
/// Typing or something but not committing right away (debounced)
export const CONTINUE_UPDATE_STATE = 'CONTINUE_UPDATE_STATE'
// Change UI state without modifying the phonebook
// that would be generated
export const FOCUS_STATE = 'FOCUS_STATE'
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE'

// Add/remove transitions
export const ADD_TRANSITION = 'ADD_TRANSITION'
export const REMOVE_TRANSITION = 'REMOVE_TRANSITION'