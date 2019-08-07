
export function evtPosition (evt) {
  return {
    x: evt.pageX,
    y: evt.pageY
  }
}

export function translate (pos, delta) {
  return {
    x: pos.x + delta.x,
    y: pos.y + delta.y
  }
}

export function delta (pos0, pos1) {
  return {
    x: pos1.x - pos0.x,
    y: pos1.y - pos0.y
  }
}

export function length (vec) {
  return (
    isZero(vec)
      ? 0
      : Math.sqrt(vec.x * vec.x + vec.y * vec.y)
  )
}

export function abs2 (vec) {
  return {
    x: Math.abs(vec.x),
    y: Math.abs(vec.x)
  }
}

/**
 * Checks if the given vector is of zero length.
 *
 * @param {Object} vec vector to check if zero
 * @returns {Boolean} `true`, if length if zero
 */
export function isZero ({ x, y }) {
  return x === 0 && y === 0
}

/**
 * Normalizes the given vector to a length of one.
 *
 * Returns the zero vector if the argument is a zero vector.
 *
 * @param {Object} vec
 * @return {Object} normalized version of the given vector
 */
export function direction (vec) {
  if (isZero(vec)) {
    return { x: 0, y: 0 }
  }

  const len = length(vec)
  return {
    x: nanToZero(vec.x / len),
    y: nanToZero(vec.y / len)
  }
}

export function distance (vec1, vec2) {
  return length(delta(vec1, vec2))
}

export function distance2 (vec1, vec2) {
  const { x, y } = delta(vec1, vec2)
  return x * x + y * y
}

export function intersectRayWithEllipse (from, direction, ellipse) {
  const { width, height, ...ellipseOffset } = ellipse

  const semiAxisA = width / 2
  const semiAxisB = height / 2

  // move line origin so it starts at origin
  const { x: originX, y: originY } = translate(
    translate(
      from,
      invert(ellipseOffset)
    ),
    { x: direction.x, y: direction.y }
  )

  const factor = (semiAxisA * semiAxisB) / Math.sqrt(
    // FIXME not zero please
    semiAxisA * semiAxisA * originY * originY +
    semiAxisB * semiAxisB * originX * originX
  )

  const intersection = {
    x: factor * originX,
    y: factor * originY
  }

  return translate(
    intersection,
    ellipseOffset
  )
}

export function invert (vec) {
  return {
    x: -vec.x,
    y: -vec.y
  }
}

function nanToZero (num) {
  return isNaN(num) ? 0.0 : num
}
