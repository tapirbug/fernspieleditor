<script>
import Auxiliary from './auxiliary.vue'
import Bar from './bar.vue'
import Drawer from './drawer.vue'
import NetworkView from './network-view.vue'
import { UNDO, REDO } from '../store/action-types.js'
import { mapGetters, mapActions } from 'vuex'
import GlobalEvents from 'vue-global-events'

export default {
  name: 'App',
  components: {
    'auxiliary': Auxiliary,
    'bar': Bar,
    'drawer': Drawer,
    'network-view': NetworkView,
    'global-events': GlobalEvents
  },
  data: function () {
    return {}
  },
  computed: {
    ...mapGetters(['canUndo', 'canRedo'])
  },
  methods: {
    ...mapActions({
      undo: UNDO,
      redo: REDO
    }),
    detectAcceleratorKeys (evt) {
      if (event.key === 'z' && this.canUndo) {
        this.undo()
      } else if ((event.key === 'y' || event.key === 'Z') && this.canRedo) {
        this.redo()
      }
    }
  }
}
</script>

<template>
  <main>
    <global-events
      @keydown.ctrl="detectAcceleratorKeys"
      @keydown.meta="detectAcceleratorKeys"
    ></global-events>
    <bar></bar>
    <section class="main-content">
      <div class="main-content-inner">
        <div class="main-content-center">
          <network-view></network-view>
        </div>
        <drawer>
          <auxiliary></auxiliary>
        </drawer>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
@use "../../style/global";
@use "../../style/variables/layout";
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
  top: layout.$header-height;
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
