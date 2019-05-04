<script>
import { length, delta, abs2 } from './points.js'

/**
 * An arrow with a label connecting two points
 */
export default {
  name: 'Arrow',
  props: {
    from: {
      type: Object,
      required: true,
      validator: isPoint
    },
    to: {
      type: Object,
      required: false,
      validator: isPoint
    }
  },
  data () {
    return {}
  },
  computed: {
    arrowStyle () {
      const fullSignedSize = delta(this.from, this.to)
      const fullLen = length(fullSignedSize)

      const startOffset = 80;

      const direction = {
        x: fullSignedSize.x / fullLen,
        y: fullSignedSize.y / fullLen
      }
      const from = {
        x: this.from.x + startOffset * direction.x,
        y: this.from.y + startOffset * direction.y
      }
      const to = {
        x: this.to.x - startOffset * direction.x,
        y: this.to.y - startOffset * direction.y
      }
      const signedSize = delta(from, to)
      const len = length(signedSize)
      
      console.log(signedSize)
      const angle = !signedSize.x ? 0 : Math.atan2(
        signedSize.y, signedSize.x
      )
      const moveToFrom = `translate(${from.x}px, ${from.y}px)`
      const rotateToTo = `rotate(${angle}rad)`
      console.log(`${rotateToTo} ${moveToFrom}`)

      return {
        'transform-origin': 'bottom left',
        transform: `translateY(-100%) ${moveToFrom} ${rotateToTo}`,
        width: `${len}px`
      }
    }
  },
  methods: {
    
  }
}

function isPoint (obj) {
  return typeof obj === 'object' &&
    typeof obj.x === 'number' &&
    typeof obj.y === 'number'
}

</script>

<template>
  <article class="arrow" v-bind:style="arrowStyle">
    <header>
      <slot></slot>
    </header>
  </article>
</template>

<style lang="scss">
$arrow-color: black;
$arrow-width: 0.6em;
$arrow-height: 0.3em;

.arrow {
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 0.1em solid $arrow-color;
  //transform: translateY(-50%);

  header {
    text-align: center;
  }

  &:after {
    content:"";
    position: absolute;
    left: 100%;
    bottom: -$arrow-height;
    width: 0; 
    height: 0; 
    border-top: $arrow-height solid transparent;
    border-bottom: $arrow-height solid transparent;
    border-left: $arrow-width solid $arrow-color;
  }
}
</style>
