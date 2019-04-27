<script>
import Bar from './bar.vue'
import Drawer from './drawer.vue'
import Inspector from './inspector.vue'
import NetworkView from './network-view.vue'

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
    'drawer': Drawer,
    'inspector': Inspector,
    'network-view': NetworkView,
  }
}
</script>

<template>
  <main>
    <bar></bar>
    <section class="main-content">
      <div class="main-content-inner">
        <div class="main-content-center">
          <network-view></network-view>
        </div>
        <drawer>
          <header>
            <inspector></inspector>
          </header>
        </drawer>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
@import "../style/global";
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

.main-content-inner {
  display: flex;
  align-items: stretch;
  height: 100%;
}

.main-content-center {
  flex-grow: 1;
  overflow: auto;
}
</style>
