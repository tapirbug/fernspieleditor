import {
  overlappingBoxes
} from '../../../../assets/javascript/util/geom/boxes.js'

describe('detect box overlap', () => {
  const size = { width: 1, height: 2 }
  const box = {
    x: 10,
    y: -10,
    ...size
  }

  test('overlap from right should be detected', () => {
    const overlappingBox = {
      x: box.x + size.width / 3, // overlap a bit
      y: box.y,
      ...size
    }

    expect(overlappingBoxes(box, overlappingBox))
      .toBe(true)
  })

  test('concentric should overlap', () => {
    const concentric = {
      ...box,
      width: 0.2
    }

    expect(overlappingBoxes(box, concentric))
      .toBe(true)
  })

  test('non-overlap to the right should be detected', () => {
    const nonOverlappingBox = {
      x: box.x + size.width + 0.001, // non-overlapping by a small margin
      y: box.y,
      ...size
    }

    expect(overlappingBoxes(box, nonOverlappingBox))
      .toBe(false)
  })

  test('touch should be detected as overlap', () => {
    const touchingBox = {
      x: box.x + size.width / 2, // just touch
      y: box.y,
      ...size
    }

    expect(overlappingBoxes(box, touchingBox))
      .toBe(true)
  })
})
