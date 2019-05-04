
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
