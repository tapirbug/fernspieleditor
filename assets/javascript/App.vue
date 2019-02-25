<script>
import Bar from './Bar.vue'
import NetworkView from './NetworkView.vue'

export default {
  name: 'app',
  data: function () {
    return {}
  },
  computed: {
  },
  methods: {
  },
  components: {
    'bar': Bar,
    'network-view': NetworkView,
  }
}
</script>

<template>
  <main>
    <bar></bar>
    <section class="main-content">
      <network-view></network-view>
    </section>
  </main>
</template>

<style lang="scss">
@import "../style/layout";
@import 'picnic/picnic.min.css';

main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.main-content {
  position: absolute;
  top: $header-height;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
