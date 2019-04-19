import run from './assets/javascript/run.js'

const existingEl = document.querySelector('#fernspieleditor-wrapper')

if (existingEl) {
  existingEl.remove()
}

const el = (() => {
  const wrapper = document.createElement('div')
  wrapper.id = 'fernspieleditor-wrapper'
  const vueEl = document.createElement('div')
  wrapper.appendChild(vueEl)
  document.body.appendChild(wrapper)
  return vueEl
})()

run(el)
