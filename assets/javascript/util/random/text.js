/**
 * Functions for random text fragments to generate madlibs-style
 * text passages.
 */
export default {
  /**
   * Picks a random name. It includes at least
   * a first name and sometimes middle and last
   * names.
   *
   * @returns {string} a random name
   */
  name () {
    return randomElement([
      'John',
      'Jane',
      'Heinz Elbert',
      'Tatiana',
      'Columbo',
      'Rachel'
    ])
  },
  /**
   * Picks a random adjective starting with a lower-case
   * letter.
   *
   * @returns {string} a random adjective
   */
  adjective () {
    return randomElement([
      'cunning',
      'drunk',
      'charming',
      'inquisitive',
      'questionable'
    ])
  },
  /**
   * Picks a random job starting with a lower-case letter.
   *
   * @returns {string} a random job description
   */
  job () {
    return randomElement([
      'giraffe doctor',
      'whale researcher',
      'nuclear physicist',
      'investigative journalist'
    ])
  },
  /**
   * Picks a random topic of discussion.
   *
   * @returns {string} a random topic
   */
  topic () {
    return randomElement([
      'wrestling',
      'bird watching',
      '3D chess',
      'free jazz'
    ])
  }
}

/**
 * Picks a random element from a non-empty array.
 *
 * @param {Array} array pool to choose from
 */
function randomElement (array) {
  return array[(Math.random() * array.length) | 0]
}
