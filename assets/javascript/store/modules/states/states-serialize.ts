import { PhonebookStates } from "../../../phonebook/phonebook-states";
import { PhonebookSubsetForStates } from "./state";
import { StatesGetters } from "./states-getters";
import { FernspieleditorExtVersion, PhonebookFernspieleditorStatesExt } from "../../../phonebook/phonebook-fernspieleditor-ext";

export function serialize (getters: StatesGetters): PhonebookSubsetForStates {
  return {
    initial: getters.initial,
    states: getters.states
      .filter(state => !getters.isAny(state.id))
      .reduce(
        (acc, { id, name, description, terminal, sounds, ring }) => {
          acc[id] = {
            name,
            description,
            terminal,
            sounds,
            ring
          }
          return acc
        },
        {} as PhonebookStates
      ),
    vendor: {
      fernspieleditor: {
        version: FernspieleditorExtVersion.Version1,
        focusedStateId: getters.focusedStateId,
        extensionProperties: {
          states: getters.states
            .filter(state => !getters.isAny(state.id))
            .reduce(
              (acc, { id, position }) => {
                acc[id] = {
                  network: { position }
                }
                return acc
              },
              {} as PhonebookFernspieleditorStatesExt
            )
        }
      }
    }
  }
}
