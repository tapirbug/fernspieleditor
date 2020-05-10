import { InfoGetters } from "./info/info-getters";
import { SerializeGetters } from "./serialize/serialize-getters";
import { StatesGetters } from "./states/states-getters";
import { TransitionGetters } from "./transitions/transitions-getters";
import { UndoGetters } from "./undo/undo-getters";

/**
 * Getters of all modules. Useful as type for root getters.
 */
export interface ModuleGetters extends InfoGetters, SerializeGetters, StatesGetters, TransitionGetters, UndoGetters {}
