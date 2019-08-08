
/**
 * Check if two axis-aligned boxes overlap.
 *
 * The boxes are specified with their center point, a width and a height.
 *
 * @param {Object} box1 box described with center point, width and height
 * @param {Object} box2 other box described with center point, width and height
 */
export function overlappingBoxes (box1, box2) {
  const min1 = {
    x: box1.x - box1.width / 2,
    y: box1.y - box1.height / 2
  }
  const min2 = {
    x: box2.x - box2.width / 2,
    y: box2.y - box2.height / 2
  }
  const max1 = {
    x: box1.x + box1.width / 2,
    y: box1.y + box1.height / 2
  }
  const max2 = {
    x: box2.x + box2.width / 2,
    y: box2.y + box2.height / 2
  }
  return min1.x < max2.x &&
      max1.x > min2.x &&
      min1.y < max2.y &&
      max1.y > min2.y
}
