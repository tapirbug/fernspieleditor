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

export function mapValues (obj, fn) {
  return Object.entries(obj)
    .map(([key, val]) => [key, fn(val)])
    .reduce(
      (acc, [key, val]) => {
        acc[key] = val
        return acc
      },
      {}
    )
}