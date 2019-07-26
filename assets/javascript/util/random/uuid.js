/**
 * Generates a v4 UUID.
 *
 * Source: https://stackoverflow.com/a/2117523
 *
 * @returns string Version 4 UUID as string of form `'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
 */
export default function uuidV4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
