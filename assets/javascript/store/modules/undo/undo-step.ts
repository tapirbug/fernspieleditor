export interface Step {
  /**
   * Mutation performed the first time.
   */
  mutation: string
  /**
   * Payload for the first mutation.
   */
  payload
  /**
   * Mutation when redoing what has been undone.
   */
  redoMutation: string
  /**
   * Payload when redoing what has been undone.
   */
  redoPayload
  /**
   * Mutation when undoing what has been done
   * and possible re-done.
   */
  undoMutation: string
  /**
   * Payload when undoing what has been done
   * and possible re-done.
   */
  undoPayload
}

/**
 * Properties to create a proper `Step` from, with all properties
 * filled in by the `createStep` function.
 */
export interface StepSpec {
  /**
   * Mutation performed the first time.
   */
  mutation: string
  /**
   * Payload for the first mutation.
   * 
   * If omitted, is set to `null`.
   */
  payload?
  /**
   * Mutation when redoing what has been undone.
   * 
   * If omitted, set to `mutation`.
   */
  redoMutation?: string
  /**
   * Payload when redoing what has been undone.
   * 
   * If omitted, is set to `payload`.
   */
  redoPayload?
  /**
   * Mutation when undoing what has been done
   * and possible re-done.
   * 
   * If omitted, is set to `mutation`.
   */
  undoMutation?: string
  /**
   * Payload when undoing what has been done
   * and possible re-done.
   * 
   * If omitted, is set to `payload`.
   */
  undoPayload?
}


/**
 * Creates a new step with the given mutation and optional payload.
 * 
 * `undoMutation` and `undoPayload` can be set to different values and fall back
 * to the same values as the original mutation and payload. `redoMutation` and
 * `redoPayload` can also be overridden and fall back to `mutation`/`payload`.
 * 
 * @param spec step specification, with at least a mutation specified.
 */
export function createStep (spec: StepSpec) : Step {
  const mutation = spec.mutation
  const payload = 'payload' in spec ? spec.payload : null
  const undoMutation = 'undoMutation' in spec ? spec.undoMutation : mutation
  const undoPayload = 'undoPayload' in spec ? spec.undoPayload : payload
  const redoMutation = 'redoMutation' in spec ? spec.redoMutation : mutation
  const redoPayload = 'redoPayload' in spec ? spec.redoPayload : payload
  const step = { mutation, payload, undoMutation, undoPayload, redoMutation, redoPayload }
  
  // make an immutable copy of the step so it cannot be changed afterwards
  const immutableStep = JSON.parse(JSON.stringify(step))
  Object.freeze(immutableStep)
  return immutableStep
}
