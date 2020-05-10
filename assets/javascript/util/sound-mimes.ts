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
 * If failing to detect, returns `null` instead.
 *
 * @param filename
 * @returns detected MIME type, or `null`
 */
export function filenameToMime (filename: string): string|null {
  const extension = filename.split('.').pop().toLowerCase()
  if (!extension) {
    return null
  }
  return extsToMime[extension] || null
}

export function isAudioFilename (filename: string): boolean {
  return filenameToMime(filename) !== null
}
