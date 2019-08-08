import { distance2 } from './points.js'

export function lineParam (from, direction, pointToFind, maxError = 0.05) {
  if (direction.x === 0 && direction.y === 0) {
    throw new Error('Direction may net be the zero vector')
  }

  if (!isFinite(direction.x) || !isFinite(direction.y)) {
    throw new Error(`Direction must consist of normal numbers, instead got: ${JSON.stringify(direction)}`)
  }

  const param = (direction.x === 0)
    ? (pointToFind.y - from.y) / direction.y
    : (pointToFind.x - from.x) / direction.x

  const expectedPointToFind = {
    x: from.x + param * direction.x,
    y: from.y + param * direction.y
  }

  if (distance2(pointToFind, expectedPointToFind) < maxError * maxError) {
    return param
  } else {
    return null
  }
}
