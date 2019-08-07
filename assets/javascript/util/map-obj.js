export function mapEntries (obj, fn) {
  return Object.entries(obj)
    .map(fn)
    .reduce(
      (acc, [key, val]) => {
        acc[key] = val
        return acc
      },
      {}
    )
}

/**
 * Returns a new object where the given function has
 * been applied to all values.
 *
 * The key is provided as a second parameter.
 *
 * @param {Object} obj
 * @param {Function} fn
 */
export function mapValues (obj, fn) {
  return Object.entries(obj)
    .map(([key, val]) => [key, fn(val, key)])
    .reduce(
      (acc, [key, val]) => {
        acc[key] = val
        return acc
      },
      {}
    )
}
