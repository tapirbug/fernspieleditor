<script>
import { evtPosition, translate, delta } from './points.js'

/**
 * An element sticking to the right side of the screen that can
 * be hidden and resized.
 */
export default {
  name: 'drawer',
  data () {
    return {
      hidden: false,
      /// Current width in percent of the parent element.
      /// If hidden, holds the last width before hiding.
      width: 20,
      dragStartPos: null
    }
  },
  computed: {
    cssWidth () {
      return this.hidden ? "0" : (this.width + "%");
    }
  },
  methods: {
    startResize (evt) {
      this.dragStartPos = evtPosition(evt)

      const moveHandler = (evt) => {
        const pos = evtPosition(evt)

        const released = evt.buttons === 0;
        if (released) {
          window.removeEventListener(
            'mousemove',
            moveHandler
          )
          this.finishResize(pos)
        } else {
          this.continueResize(pos)
        }
      }

      window.addEventListener(
        'mousemove',
        moveHandler
      )
    },
    continueResize (to) {
      const deltaX = this.dragStartPos.x - to.x;
      this.$el.style.flexBasis = `${this.width + this.pxToPercentOfParent(deltaX)}%`
    },
    finishResize (at) {
      const deltaX = this.dragStartPos.x - at.x;
      this.width += this.pxToPercentOfParent(deltaX)
    },
    pxToPercentOfParent (px) {
      if(!px) {
        return 0
      }

      const containerSize = this.$el.parentElement.getBoundingClientRect()
      return 100 * (px / containerSize.width)
    }
  }
}
</script>

<template>
  <section class="drawer"
           v-bind:style="{ 'flex-basis': cssWidth }">

    <div class="drawer-grabbing-area"
         v-on:mousedown="startResize"></div>

    <slot></slot>
  </section>
</template>

<style lang="scss">
$drawer-grabbing-area-width: 1em;

.drawer {
  position: relative;
  background-color: #f0f0f0;
  box-shadow: -2px 0px 9px 1px #aaa;
}

.drawer-grabbing-area {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -($drawer-grabbing-area-width / 2);
  width: $drawer-grabbing-area-width;
  cursor: w-resize;
}
</style>
