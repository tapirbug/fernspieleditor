/**
 * fernspieleditor-specific additions to the phonebook format, e.g.
 * positions of state in the editor.
 *
 * Stored under the key `vendor/fernspieleditor` in a phonebook.
 */
export interface PhonebookFernspieleditorExt {
  version: FernspieleditorExtVersion.Version1
  focusedStateId: null
  extensionProperties: PhonebookFernspieleditorExtProperties
}

export interface PhonebookFernspieleditorExtProperties {
  states: PhonebookFernspieleditorStatesExt
}

export interface PhonebookFernspieleditorStatesExt {
  [stateIdsAgainstExtensionProperties: string]: PhonebookFernspieleditorStateExt
}

/**
 * Additional properties for states used in the editor, but
 * not in the fernspielapparat.
 */
export interface PhonebookFernspieleditorStateExt {
  removed: boolean
  network: PhonebookFernspieleditorStateNetworkExt
}

export interface PhonebookFernspieleditorStateNetworkExt {
  position: Vec2D
}

export interface Vec2D {
  x: number
  y: number
}

const enum FernspieleditorExtVersion {
  Version1 = 1
}
