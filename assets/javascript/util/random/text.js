/**
 * Functions for random text fragments to generate madlibs-style
 * text passages.
 */
const random = {
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
   * Picks a random adjective for a person, starting with
   * a lower-case letter.
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
   * Picks a random phonebook title.
   *
   * @returns {string} a random adjective
   */
  phonebookName () {
    const phonebookAdjective = random.lyricalOrLiteraryFormOfArtAdjective()
    const personAdjective = random.adjective()
    const personAdjectiveInitialChar = personAdjective.charAt(0)
    const personAdjectiveStartsWithVowel =
      personAdjectiveInitialChar === 'a' ||
      personAdjectiveInitialChar === 'e' ||
      personAdjectiveInitialChar === 'i' ||
      personAdjectiveInitialChar === 'o' ||
      personAdjectiveInitialChar === 'u'
    const personArticle = personAdjectiveStartsWithVowel ? 'an' : 'a'
    const job = random.job()
    const art = random.lyricalOrLiteraryFormOfArt()
    return titleCase(
      `the ${phonebookAdjective} ${art} of ${personArticle} ${personAdjective} ${job}`
    )
  },
  lyricalOrLiteraryFormOfArt () {
    return randomElement([
      'story',
      'song',
      'study',
      'poem',
      'haiku',
      'chanson'
    ])
  },
  lyricalOrLiteraryFormOfArtAdjective () {
    return randomElement([
      'devastating',
      'ridiculous',
      'awesome',
      'refreshing',
      'epic',
      'well thought-out',
      'amazing',
      'frankly quite boring',
      'overrated',
      'insightful',
      'inspiring'
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

export default random

/**
 * Picks a random element from a non-empty array.
 *
 * @param {Array} array pool to choose from
 */
function randomElement (array) {
  return array[(Math.random() * array.length) | 0]
}

/**
 * Returns a new string with the first character made upper-case.
 *
 * @param {string} word word or sentence to make uppercase at the first char
 */
function ucFirst (word) {
  return (typeof word !== 'string' || word.length === 0)
    ? ''
    : word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * Converts a sentence to title case.
 *
 * That is, most words will be made upper-case, except some
 * short particles such as "a" or "the".
 *
 * @param {*} sentence piece of text to convert to title case
 */
function titleCase (sentence) {
  const words = sentence.split(/\s+/)
  const lastWordIndex = sentence.length - 1
  return words.map(
    (word, index) => isTitleCaseCapitalized(
      word,
      index === 0,
      index === lastWordIndex
    ) ? ucFirst(word) : word
  ).join(' ')
}

/**
 * Words that should not be made lower-case for title case.
 */
const titleCaseParticles = [ 'a', 'an', 'in', 'the', 'for', 'of' ]

/**
 * Checks if a word would be capitalized if it occurred in
 * a title.
 *
 * @param {string} word word to check if would be capitalized in a title
 * @param {boolean} isFirstWord if `true`, the word is the first word in a potential title
 * @param {boolean} isLastWord if `true`, the word is the last word in a potential title
 */
function isTitleCaseCapitalized (word, isFirstWord, isLastWord) {
  return isFirstWord ||
    isLastWord ||
    !titleCaseParticles.includes(word)
}
