<script>
import { evtPosition } from '../util/geom/points.js'

/**
 * An element sticking to the right side of the screen that can
 * be hidden and resized.
 */
export default {
  name: 'Drawer',
  data () {
    return {
      hidden: false,
      /// min width in pixels, not percent
      minWidth: 300,
      /// max width in percent
      maxWidth: 50,
      /// Current width in percent of the parent element.
      /// If hidden, holds the last width before hiding.
      width: 22,
      dragStartPos: null,
      parentWidth: 0
    }
  },
  computed: {
    actualWidth () {
      return this.hidden
        ? '0'
        : this.guardSize(this.width)
    },
    cssWidth () {
      return `${this.actualWidth}%`
    }
  },
  mounted () {
    window.removeEventListener('resize', this.handleContainerResize)
    window.addEventListener('resize', this.handleContainerResize)
    this.handleContainerResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleContainerResize)
  },
  methods: {
    handleContainerResize () {
      this.parentWidth = this.$el.parentElement.getBoundingClientRect().width
    },
    startResize (evt) {
      this.dragStartPos = evtPosition(evt)

      const moveHandler = (evt) => {
        const pos = evtPosition(evt)

        const released = evt.buttons === 0
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
      const deltaX = this.dragStartPos.x - to.x
      this.$el.style.flexBasis = `${this.guardSize(this.width + this.pxToPercentOfParent(deltaX))}%`
    },
    finishResize (at) {
      const deltaX = this.dragStartPos.x - at.x
      this.width += this.pxToPercentOfParent(deltaX)
    },
    pxToPercentOfParent (px) {
      const containerSize = this.parentWidth

      if (!px || !this.$el) {
        return 0
      }

      return 100 * (px / containerSize)
    },
    guardSize (desiredPercent) {
      return Math.max(
        this.pxToPercentOfParent(this.minWidth),
        Math.min(desiredPercent, this.maxWidth)
      )
    }
  }
}
</script>

<template>
  <section
    class="drawer"
    :style="{ 'flex-basis': cssWidth }"
  >
    <div
      class="drawer-grabbing-area"
      @mousedown="startResize"
    ></div>

    <slot></slot>
  </section>
</template>

<style lang="scss">
$drawer-grabbing-area-width: 1em;

.drawer {
  position: relative;
  background-color: #f0f0f0;
  box-shadow: -2px 0px 9px 1px #aaa;
  overflow: auto;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.drawer-grabbing-area {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 10000;
  left: -($drawer-grabbing-area-width / 2);
  width: $drawer-grabbing-area-width;
  cursor: w-resize;
}
</style>
