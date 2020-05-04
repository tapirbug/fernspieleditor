import { StepSpec, createStep } from "./undo-step";
import { DO } from "../../mutation-types";
import { createTransaction } from "./undo-transaction";

export default function performReversible(commit, title: string, stepSpecOrSpecs: StepSpec | StepSpec[]) {
  const transaction = createTransaction({ title, stepSpecOrSpecs })

  // do it for the first time
  for(const step of transaction.steps) {
    commit(step.mutation, step.payload, { root: true })
  }

  // and save the mutations for later undoing and redoing
  // the payload for the first do is actually not necessary,
  // but might come in handy for debugging
  commit(DO, transaction, { root: true })
}
