/**
 * Converts a file object to a data URI and returns
 * a promise for it.
 *
 * @param {File} file
 */
export function toDataURL (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = err => {
      reject(new Error(err))
    }
    reader.readAsDataURL(file)
  })
}
