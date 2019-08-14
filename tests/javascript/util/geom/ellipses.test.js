import {
  intersectRayWithEllipse,
  connectEllipses
} from '../../../../assets/javascript/util/geom/ellipses.js'

// We assume a cartesian coordinate system for the test, with Y pointing up.
// The browser works different but the math should still work out when Y is flipped.

/** origin of the coordinate system */
const origin = { x: 0, y: 0 }

// positions on the unit circle
const top = { x: 0, y: 1 }
const right = { x: 1, y: 0 }
const bottom = { x: 0, y: -1 }
const left = { x: -1, y: 0 }

// normalized direction vectors
const up = top
const down = bottom
// just re-use right and left for both positions and directions

/** circle with radius 1 at origin */
const unitCircle = {
  ...origin,
  width: 2,
  height: 2
}
/** Hits are allowed this much error from the actual hit point to be considered correct */
const tolerance = 0.01

describe('intersecting rays with ellipses', () => {
  describe('axis-aligned rays from origin onto origin-centered unit circle', () => {
    test('negative Y direction hits bottom', () => {
      const intersection = intersectRayWithEllipse(
        origin,
        down,
        unitCircle
      )

      expect(intersection)
        .toEqual(bottom)
    })

    test('positive Y direction hits top', () => {
      const intersection = intersectRayWithEllipse(
        origin,
        up,
        unitCircle
      )

      expect(intersection)
        .toEqual(top)
    })

    test('negative X direction hits left', () => {
      const intersection = intersectRayWithEllipse(
        origin,
        left,
        unitCircle
      )

      expect(intersection)
        .toEqual(left)
    })

    test('positive X direction hits right', () => {
      const intersection = intersectRayWithEllipse(
        origin,
        right,
        unitCircle
      )

      expect(intersection)
        .toEqual(right)
    })
  })

  describe('diagonal rays from origin onto origin-centered unit circle', () => {
    const origin = { x: 0, y: 0 }
    const unitCircle = {
      ...origin,
      width: 2,
      height: 2
    }
    const topRight = {
      x: Math.sin(Math.PI / 4),
      y: Math.sin(Math.PI / 4)
    }
    const bottomRight = {
      x: Math.sin(Math.PI / 4),
      y: -Math.sin(Math.PI / 4)
    }
    const topLeft = {
      x: -Math.sin(Math.PI / 4),
      y: Math.sin(Math.PI / 4)
    }
    const bottomLeft = {
      x: -Math.sin(Math.PI / 4),
      y: -Math.sin(Math.PI / 4)
    }

    test('+X/+Y direction hits top right of circle', () => {
      const intersection = intersectRayWithEllipse(
        origin,
        { x: 1, y: 1 },
        unitCircle
      )

      const errorX = Math.abs(intersection.x - topRight.x)
      const errorY = Math.abs(intersection.y - topRight.y)
      expect(errorX)
        .toBeLessThan(tolerance)
      expect(errorY)
        .toBeLessThan(tolerance)
    })

    test('+X/-Y direction hits bottom right of circle', () => {
      const intersection = intersectRayWithEllipse(
        origin,
        { x: 1, y: -1 },
        unitCircle
      )

      const errorX = Math.abs(intersection.x - bottomRight.x)
      const errorY = Math.abs(intersection.y - bottomRight.y)
      expect(errorX)
        .toBeLessThan(tolerance)
      expect(errorY)
        .toBeLessThan(tolerance)
    })

    test('-X/+Y direction hits top left of circle', () => {
      const intersection = intersectRayWithEllipse(
        origin,
        { x: -1, y: 1 },
        unitCircle
      )

      const errorX = Math.abs(intersection.x - topLeft.x)
      const errorY = Math.abs(intersection.y - topLeft.y)
      expect(errorX)
        .toBeLessThan(tolerance)
      expect(errorY)
        .toBeLessThan(tolerance)
    })

    test('-X/-Y direction hits bottom left of circle', () => {
      const intersection = intersectRayWithEllipse(
        origin,
        { x: -1, y: -1 },
        unitCircle
      )

      const errorX = Math.abs(intersection.x - bottomLeft.x)
      const errorY = Math.abs(intersection.y - bottomLeft.y)
      expect(errorX)
        .toBeLessThan(tolerance)
      expect(errorY)
        .toBeLessThan(tolerance)
    })
  })

  describe('diagonal rays onto ellipse from the outside', () => {
    const origin = { x: 0, y: 0 }
    const circle = {
      ...origin,
      width: 2,
      height: 2
    }
    const topRight = {
      x: Math.sin(Math.PI / 4),
      y: Math.sin(Math.PI / 4)
    }
    const bottomRight = {
      x: Math.sin(Math.PI / 4),
      y: -Math.sin(Math.PI / 4)
    }
    const topLeft = {
      x: -Math.sin(Math.PI / 4),
      y: Math.sin(Math.PI / 4)
    }
    const bottomLeft = {
      x: -Math.sin(Math.PI / 4),
      y: -Math.sin(Math.PI / 4)
    }

    test('+X/+Y direction hits bottom left of circle', () => {
      const fromBottomLeft = {
        x: bottomLeft.x * 100,
        y: bottomLeft.x * 100
      }

      const intersection = intersectRayWithEllipse(
        fromBottomLeft,
        { x: 1, y: 1 },
        circle
      )

      const errorX = Math.abs(intersection.x - bottomLeft.x)
      const errorY = Math.abs(intersection.y - bottomLeft.y)
      expect(errorX)
        .toBeLessThan(tolerance)
      expect(errorY)
        .toBeLessThan(tolerance)
    })

    test('+X/-Y direction hits top left of circle', () => {
      const fromTopLeft = {
        x: topLeft.x * 100,
        y: topLeft.y * 100
      }

      const intersection = intersectRayWithEllipse(
        fromTopLeft,
        { x: 1, y: -1 },
        circle
      )

      const errorX = Math.abs(intersection.x - topLeft.x)
      const errorY = Math.abs(intersection.y - topLeft.y)
      expect(errorX)
        .toBeLessThan(tolerance)
      expect(errorY)
        .toBeLessThan(tolerance)
    })

    test('-X/+Y direction hits top left of circle', () => {
      const fromBottomRight = {
        x: bottomRight.x * 100,
        y: bottomRight.y * 100
      }

      const intersection = intersectRayWithEllipse(
        fromBottomRight,
        { x: -1, y: 1 },
        circle
      )

      const errorX = Math.abs(intersection.x - bottomRight.x)
      const errorY = Math.abs(intersection.y - bottomRight.y)
      expect(errorX)
        .toBeLessThan(tolerance)
      expect(errorY)
        .toBeLessThan(tolerance)
    })

    test('-X/-Y direction hits top right of circle', () => {
      const fromTopRight = {
        x: topRight.x * 100,
        y: topRight.x * 100
      }

      const intersection = intersectRayWithEllipse(
        fromTopRight,
        { x: -1, y: -1 },
        circle
      )

      const errorX = Math.abs(intersection.x - topRight.x)
      const errorY = Math.abs(intersection.y - topRight.y)
      expect(errorX)
        .toBeLessThan(tolerance)
      expect(errorY)
        .toBeLessThan(tolerance)
    })
  })

  describe('vertical rays from outside eclipse', () => {
    const center = { x: 128, y: 1000 }
    const size = { width: 123, height: 40 }
    const ellipse = { ...center, ...size }
    const ellipseBottom = { x: center.x, y: center.y - 0.5 * size.height }
    const ellipseTop = { x: center.x, y: center.y + 0.5 * size.height }
    const ellipseLeft = { x: center.x - 0.5 * size.width, y: center.y }
    const ellipseRight = { x: center.x + 0.5 * size.width, y: center.y }

    test('from below onto the bottom of the ellipse', () => {
      const from = {
        x: center.x,
        y: center.y - 2 * size.height
      }

      const intersection = intersectRayWithEllipse(
        from,
        up,
        ellipse
      )

      expect(intersection)
        .toEqual(ellipseBottom)
    })

    test('from above onto the top of the ellipse', () => {
      const from = {
        x: center.x,
        y: center.y + 2 * size.height
      }

      const intersection = intersectRayWithEllipse(
        from,
        down,
        ellipse
      )

      expect(intersection)
        .toEqual(ellipseTop)
    })

    test('from left onto the left side of the ellipse', () => {
      const from = {
        x: center.x - size.width,
        y: center.y
      }

      const intersection = intersectRayWithEllipse(
        from,
        right,
        ellipse
      )

      expect(intersection)
        .toEqual(ellipseLeft)
    })

    test('from right onto the right side of the ellipse', () => {
      const from = {
        x: center.x + size.width,
        y: center.y
      }

      const intersection = intersectRayWithEllipse(
        from,
        left,
        ellipse
      )

      expect(intersection)
        .toEqual(ellipseRight)
    })
  })

  describe('near-horizontal lines', () => {
    // TODO implement
  })

  describe('ray misses eclipse', () => {
    const center = {
      x: 100,
      y: 300
    }
    const ellipse = {
      ...center,
      width: 1,
      height: 1
    }
    // ray starts right of the ellipse
    const rayStart = {
      x: center.x + 2,
      y: center.y
    }

    test('opposite direction', () => {
      const right = { x: 1, y: 0 }
      const intersection = intersectRayWithEllipse(
        rayStart,
        right,
        ellipse
      )
      expect(intersection).toBe(null)
    })

    test('offset in X direction and orthogonal', () => {
      const up = { x: 0, y: 1 }
      const intersection = intersectRayWithEllipse(
        rayStart,
        up,
        ellipse
      )
      expect(intersection).toBe(null)
    })
  })
})

describe('connect non-overlapping ellipses in vertical direction', () => {
  const topEllipse = {
    x: 10,
    y: 30,
    width: 2,
    height: 1
  }
  const topEllipseBottom = { x: 10, y: 29.5 }
  const bottomEllipse = {
    x: 10,
    y: -30,
    width: 1,
    height: 2
  }
  const bottomEllipseTop = { x: 10, y: -29 }

  test('connect down has correct order', () => {
    const { from, to } = connectEllipses(topEllipse, bottomEllipse)

    expect([from, to])
      .toEqual([topEllipseBottom, bottomEllipseTop])
  })

  test('connect up has correct order', () => {
    const { from, to } = connectEllipses(bottomEllipse, topEllipse)

    expect([from, to])
      .toEqual([bottomEllipseTop, topEllipseBottom])
  })
})

describe('connect non-overlapping ellipses in horizontal direction', () => {
  const leftEllipse = {
    height: 109,
    width: 109,
    x: 100,
    y: 100
  }
  const leftEllipseRight = {
    x: leftEllipse.x + leftEllipse.width / 2,
    y: leftEllipse.y
  }
  const rightEllipse = {
    height: 109,
    width: 109,
    x: 300,
    y: 100
  }
  const rightEllipseLeft = {
    x: rightEllipse.x - rightEllipse.width / 2,
    y: rightEllipse.y
  }

  test('connect down has correct order', () => {
    const { from, to } = connectEllipses(leftEllipse, rightEllipse)

    expect([from, to])
      .toEqual([leftEllipseRight, rightEllipseLeft])
  })

  test('connect up has correct order', () => {
    const { from, to } = connectEllipses(rightEllipse, leftEllipse)

    expect([from, to])
      .toEqual([rightEllipseLeft, leftEllipseRight])
  })
})

describe('connect non-overlapping ellipses diagonally', () => {
  const ellipse1 = {
    height: 109,
    width: 109,
    x: 100,
    y: 100
  }
  const ellipse2 = {
    height: 109,
    width: 109,
    x: 500,
    y: 300
  }

  test('top left to bottom right', () => {
    const { from, to } = connectEllipses(ellipse1, ellipse2)

    expect(from.x)
      .toBeGreaterThan(ellipse1.x)
    expect(from.x)
      .toBeLessThan(ellipse1.x + 0.45 * ellipse1.width)
    expect(from.y)
      .toBeGreaterThan(ellipse1.y)
    expect(from.y)
      .toBeLessThan(ellipse1.y + 0.45 * ellipse1.height)
    expect(to.x)
      .toBeGreaterThan(ellipse2.x - 0.45 * ellipse2.width)
    expect(to.x)
      .toBeLessThan(ellipse2.x - 0.1 * ellipse2.width)
    expect(to.y)
      .toBeGreaterThan(ellipse2.y - 0.45 * ellipse2.height)
    expect(to.y)
      .toBeLessThan(ellipse2.y - 0.1 * ellipse2.height)
  })

  test('bottom right to top left', () => {
    const { from, to } = connectEllipses(ellipse2, ellipse1)

    expect(to.x)
      .toBeGreaterThan(ellipse1.x)
    expect(to.x)
      .toBeLessThan(ellipse1.x + 0.45 * ellipse1.width)
    expect(to.y)
      .toBeGreaterThan(ellipse1.y)
    expect(to.y)
      .toBeLessThan(ellipse1.y + 0.45 * ellipse1.height)
    expect(from.x)
      .toBeGreaterThan(ellipse2.x - 0.45 * ellipse2.width)
    expect(from.x)
      .toBeLessThan(ellipse2.x - 0.1 * ellipse2.width)
    expect(from.y)
      .toBeGreaterThan(ellipse2.y - 0.45 * ellipse2.height)
    expect(from.y)
      .toBeLessThan(ellipse2.y - 0.1 * ellipse2.height)
  })
})

describe('connect overlapping ellipses', () => {
  const size = { width: 2.1, height: 2.1 }
  const topEllipseCenter = { x: 1, y: 1 }
  const bottomEllipseCenter = { x: 1, y: -1 }
  const topEllipse = {
    ...topEllipseCenter,
    ...size

  }
  const bottomEllipse = {
    ...bottomEllipseCenter,
    ...size
  }

  test('centers should be connected instead of perimeters', () => {
    const { from, to } = connectEllipses(topEllipse, bottomEllipse)

    expect(from)
      .toEqual(topEllipseCenter)
    expect(to)
      .toEqual(bottomEllipseCenter)
  })
})

describe('connect identical ellipses', () => {
  const size = { width: 2.1, height: 2.1 }
  const center = { x: 1, y: 1 }
  const ellipse1 = {
    ...size,
    ...center
  }
  const ellipse2 = { ...ellipse1 }

  test('centers should be connected instead of perimeters', () => {
    const { from, to } = connectEllipses(ellipse1, ellipse2)

    expect(from)
      .toEqual(center)
    expect(to)
      .toEqual(center)
  })
})

describe('connect touching ellipses', () => {
  const size = { width: 2.1, height: 2.1 }
  const contactPoint = { x: 14, y: -10 }
  const ellipse1 = {
    x: contactPoint.x - size.width / 2,
    y: contactPoint.y,
    ...size
  }
  const ellipse2 = {
    x: contactPoint.x + size.width / 2,
    y: contactPoint.y,
    ...size
  }

  test('contact points should be identical', () => {
    const { from, to } = connectEllipses(ellipse1, ellipse2)

    expect(from)
      .toEqual(contactPoint)
    expect(to)
      .toEqual(contactPoint)
  })
})
