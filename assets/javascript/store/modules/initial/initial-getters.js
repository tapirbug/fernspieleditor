export default {
  /**
   * Get the initial state ID.
   */
  initial: initialState => initialState.initial,
  isInitial: initialState => id =>
    initialState.initial === id,
}