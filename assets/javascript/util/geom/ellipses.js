import {
  invert,
  direction,
  delta
} from './points.js'
import {
  lineParam
} from './lines.js'
import {
  overlappingBoxes
} from './boxes.js'
import {
  translate
} from './transform.js'

/**
 * Returns the closest intersection of the given ray with an axis-aligned
 * ellipse, specified with its center point and width and height.
 *
 * Returns `null` if the ray does not touch the ellipse at any point.
 *
 * Backward hits are also reported as `null`, that is, hits never point
 * in the reverse direction of the ray.
 *
 * @param {*} from      vector to the starting point of the ray
 * @param {*} direction vector indicating direction of the ray
 * @param {*} ellipse   ellipse to intersect with
 */
export function intersectRayWithEllipse (from, direction, ellipse) {
  return intersectLineWithEllipse(from, direction, ellipse)
    // calculate distance on the ray
    .map(solution => [ lineParam(from, direction, solution), solution ])
    // drop misses and solutions in the reverse direction of the ray
    .filter(([param, _]) => param !== null && isFinite(param) && param >= 0)
    // sort solutions by ray parameter, that is by proximity to the ray origin
    .sort(byLineParam)
    // and take the closest remaining solution or return null
    .map(([_, solution]) => solution)
    .shift() || null

  function byLineParam ([a, _1], [b, _2]) {
    if (a < b) {
      return -1
    } else if (a > b) {
      return 1
    } else {
      return 0
    }
  }
}

/**
 * Returns an array of intersection points of the given line with an axis-aligned
 * ellipse, specified with its center point and width and height.
 *
 * Returns `[]` if the line does not touch the ellipse at any point.
 *
 * Backward hits are also contained in the array of the hits, that is, the direction
 * can be flipped and will yield the same contact points.
 *
 * The order of results is undefined.
 *
 * @param {*} from      vector to the starting point of the ray
 * @param {*} direction vector indicating direction of the ray
 * @param {*} ellipse   ellipse to intersect with
 */
export function intersectLineWithEllipse (from, direction, ellipse) {
  if ((direction.x === 0 && direction.y === 0) || (!isFinite(direction.x) || !isFinite(direction.y))) {
    throw new Error(`Direction must be non-zero and finite, got: ${JSON.stringify(direction)}`)
  }

  if (ellipse.width === 0 || ellipse.height === 0) {
    throw new Error(`Intersections with zero-area ellipses are not supported`)
  }

  const halfWidth = ellipse.width / 2
  const halfHeight = ellipse.height / 2

  if (direction.x === 0) {
    // special case for completely vertical line, to avoid singularity
    const horizontalOffset = from.x - ellipse.x
    if (Math.abs(horizontalOffset) > halfWidth) {
      // vertical line does not touch the eclipse, miss
      return []
    } else if (horizontalOffset === halfWidth || horizontalOffset === -halfWidth) {
      // vertical line touches the left or right edge
      return [
        {
          x: ellipse.x + halfWidth,
          y: ellipse.y
        },
        {
          x: ellipse.x - halfWidth,
          y: ellipse.y
        }
      ]
    } else {
      // vertical line hits somewhere else, solve the ellipse and pick
      // the solution in the right direction
      const ySolution = Math.sqrt(
        halfHeight * halfHeight - (
          (horizontalOffset * horizontalOffset * halfHeight * halfHeight) /
          (halfWidth * halfWidth)
        )
      )
      return [
        {
          x: ellipse.x + horizontalOffset,
          y: ellipse.y + ySolution
        },
        {
          x: ellipse.x + horizontalOffset,
          y: ellipse.y - ySolution
        }
      ]
    }
  } else if (direction.y === 0) {
    // special case for completely horizontal line, to avoid singularity
    const verticalOffset = from.y - ellipse.y
    if (Math.abs(verticalOffset) > halfHeight) {
      // horizontal line does not touch the eclipse, miss
      return []
    } else if (verticalOffset === halfHeight || verticalOffset === -halfHeight) {
      // horizontal line touches the top or bottom edge
      return [
        {
          x: ellipse.x,
          y: ellipse.y + halfHeight
        },
        {
          x: ellipse.x,
          y: ellipse.y - halfHeight
        }
      ]
    } else {
      // vertical line hits somewhere else, solve the ellipse and pick
      // the solution in the right direction
      const xSolution = Math.sqrt(
        halfWidth * halfWidth - (
          (verticalOffset * verticalOffset * halfWidth * halfWidth) /
          (halfHeight * halfHeight)
        )
      )
      return [
        {
          y: ellipse.y + verticalOffset,
          x: ellipse.x + xSolution
        },
        {
          y: ellipse.y + verticalOffset,
          x: ellipse.x - xSolution
        }
      ]
    }
  } else {
    // move ray origin so we can consider the ellipse to be centered around
    // the origin
    const movedFrom = translate(from, invert(ellipse))

    // solve all lines except completely vertical or horizontal ones
    // explanation of the math: https://gieseanw.wordpress.com/2013/07/19/an-analytic-solution-for-ellipse-and-line-intersection/
    const slope = direction.y / direction.x
    const yIntercept = movedFrom.y - slope * movedFrom.x

    const termA = -(
      (2 * halfWidth * halfWidth * yIntercept * slope) /
      (2 * (halfHeight * halfHeight + halfWidth * halfWidth * slope * slope))
    )
    const termB = halfWidth * Math.sqrt(
      (
        (halfHeight * halfHeight - yIntercept * yIntercept) /
        (halfHeight * halfHeight + halfWidth * halfWidth * slope * slope)
      ) +
      (
        (halfWidth * halfWidth * yIntercept * yIntercept * slope * slope) /
        Math.pow(
          (halfHeight * halfHeight + halfWidth * halfWidth * slope * slope),
          2
        )
      )
    )

    return [
      {
        // revert the translation towards the origin
        x: ellipse.x + termA + termB,
        y: ellipse.y + slope * (termA + termB) + yIntercept
      },
      {
        x: ellipse.x + termA - termB,
        y: ellipse.y + slope * (termA - termB) + yIntercept
      }
    ]
  }
}

/**
 * Returns the shortest line segment connecting two ellipses
 * as an object with a `from` and a `to` property, each holding
 * a 2D vector with `x` and `y`, indicating the two contact points.
 *
 * The ellipses are given as objects with the required
 * properties `x`/`y` (position of the center of the ellipse),
 * and `width`/`height` (full axis lengths in horizontal/vertical
 * direction).
 *
 * If the ellipses bounding boxes intersect each other, a line between
 * the two centers is returned instead.
 *
 * If the ellipses have identical centers, then the returned `from`
 * and `to` are both set to an independent copy of the shared ellipse
 * center.
 *
 * If the ellipses exactly touch, `from` and `to` will also be equal.
 *
 * @param {Object} fromEllipse the ellipse where the line starts at the perimeter
 * @param {Object} toEllipse   the ellipse where the line ends at the perimeter
 */
export function connectEllipses (fromEllipse, toEllipse) {
  if (identicalEllipses(fromEllipse, toEllipse) ||
      overlappingBoxes(fromEllipse, toEllipse)) {
    // Connect the possibly identical centers directly for
    // close ellipses
    return {
      from: { x: fromEllipse.x, y: fromEllipse.y },
      to: { x: toEllipse.x, y: toEllipse.y }
    }
  }

  const fromSize = { width: fromEllipse.width, height: fromEllipse.height }
  const fromPos = { x: fromEllipse.x, y: fromEllipse.y }
  const toSize = { width: toEllipse.width, height: toEllipse.height }
  const toPos = { x: toEllipse.x, y: toEllipse.y }
  const directionFromTo = direction(delta(fromPos, toPos))
  const directionToFrom = invert(directionFromTo)

  return {
    from: intersectRayWithEllipse(
      fromPos,
      directionFromTo,
      {
        ...fromPos,
        ...fromSize
      }
    ),
    to: intersectRayWithEllipse(
      toPos,
      directionToFrom,
      {
        ...toPos,
        ...toSize
      }
    )
  }
}

function identicalEllipses (ellipse1, ellipse2) {
  return ellipse1.x === ellipse2.x &&
    ellipse1.y === ellipse2.y &&
    ellipse1.width === ellipse2.width &&
    ellipse1.height === ellipse2.height
}
