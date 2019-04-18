import run from './assets/javascript/run.js'

const existingEl = document.querySelector('#fernspieleditor-wrapper')
const el = existingEl || (() => {
  const el = document.createElement('div')
  el.id = 'fernspieleditor-wrapper'
  document.body.appendChild(el)
  return el
})()

run(el)
