export function translate (pos, delta) {
  return {
    ...pos, // keep other properties
    x: pos.x + delta.x,
    y: pos.y + delta.y
  }
}
