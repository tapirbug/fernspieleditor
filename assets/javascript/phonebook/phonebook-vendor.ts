import { PhonebookFernspieleditorExt } from './phonebook-fernspieleditor-ext'

export interface PhonebookVendor {
  /**
   * This is the namespace of the fernspieleditor, which we may
   * change to store information that does not change the semantics
   * of the phonebook but is useful for the editor.
   *
   * Example: this stores the positions of states in the editor,
   * which does not have any meaning for the actual fernspielapparat.
   */
  fernspieleditor: PhonebookFernspieleditorExt
  /**
   * Any editing application may assign itself a namespace and
   * store custom data here, fernspieleditor will not change it.
   */
  [namespaceAgainstOtherVendorContent: string]: object
}
