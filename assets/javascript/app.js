import Vue from 'vue'
import App from './App.vue'

export default function run (element) {
  return new Vue({
    el: element,
    render: h => h(App)
  })
}
