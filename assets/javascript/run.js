import Vue from 'vue'
import App from './view/app.vue'
import store from './store/index.js'
import 'regenerator-runtime' // polyfill for async functions

export default function run (element) {
  return new Vue({
    el: element,
    store,
    render: h => h(App)
  })
}
