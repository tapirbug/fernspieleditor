const extsToMime = {
  'wav': 'audio/wav',
  'wave': 'audio/wav',
  'mp3': 'audio/mpeg',
  'mp4': 'audio/mp4'
}

/**
 * Tries to detect the mime type of the given audio
 * file.
 *
 * If failing to detect, returns `false` instead.
 *
 * @param {string} filename
 * @returns {string} detected MIME type
 */
export function filenameToMime (filename) {
  const extension = filename.split('.').pop().toLowerCase()
  if (!extension) {
    return false
  }
  return extsToMime[extension] || false
}

export function isAudioFilename (filename) {
  return !!filenameToMime(filename)
}
