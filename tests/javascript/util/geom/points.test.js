import { invert } from '../../../../assets/javascript/util/geom/points.js'

test('invert changes sign', () => {
  let vec = { x: 5, y: -1 }
  let invertedVec = { x: -5, y: 1 }

  expect(invert(vec))
    .toEqual(invertedVec)
})
