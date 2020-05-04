import { Step, StepSpec, createStep } from "./undo-step";

export interface Transaction {
  /**
   * Summary of the reversible action in sentence case, e.g.
   * `"Remove transition 3"`.
   */
  title: string
  /**
   * Steps to apply in iteration order to do it the first time.
   * To redo, apply the redo mutations in iteration order.
   * To undo, apply the undo mutations in reverse order.
   */
  steps: Step[]
}

export interface TransactionSpec {
  /**
   * Summary of the reversible action in sentence case, e.g.
   * `"Remove transition 3"`.
   */
  title: string
  /**
   * Step or steps to apply in iteration order to do it the first time.
   * To redo, apply the redo mutations in iteration order.
   * To undo, apply the undo mutations in reverse order.
   */
  stepSpecOrSpecs: StepSpec | StepSpec[]
}

/**
 * Instantiates a transaction from the given specification.
 * 
 * @param spec title and step(s)
 */
export function createTransaction(spec: TransactionSpec): Transaction {
  const { title, stepSpecOrSpecs } = spec
  const stepSpecs = ('length' in stepSpecOrSpecs)
    ? stepSpecOrSpecs
    : [ stepSpecOrSpecs ]
  const steps = stepSpecs.map(createStep)
  return {
    title,
    steps
  }
}
