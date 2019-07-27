/**
 * Modifies the given object in-place by applying
 * the given function to the property specified
 * with the given string.
 *
 * No effect is property is undefined.
 *
 * @param {object} obj Object to modify in-place
 * @param {string} prop Property to modify
 * @param {function} cleaner Returns cleaned version of the property value, if present
 */
export function cleanIfPresent (obj, prop, cleaner) {
  if (typeof obj[prop] !== 'undefined') {
    obj[prop] = cleaner(obj[prop])
  }
}
