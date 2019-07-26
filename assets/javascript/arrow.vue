<script>
import { length, delta } from './points.js'

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
      required: true,
      validator: isPoint
    },
    normalOffset: {
      type: String,
      required: false,
      default: '0'
    },
    /// Leave out this many pixels of the arrow at the
    /// beginning and and the end, except if that would
    /// reverse the direction of the arrow.
    trim: {
      type: Number,
      required: false,
      default: 100
    },
    /// When resulting arrow would be smaller than this, extend outwards
    /// and grow to this size.
    minLength: {
      type: Number,
      required: false,
      default: 30
    }
  },
  data () {
    return {}
  },
  computed: {
    arrowStyle () {
      const fullSignedSize = delta(this.from, this.to)
      const fullLen = length(fullSignedSize)
      const direction = {
        x: fullSignedSize.x / fullLen,
        y: fullSignedSize.y / fullLen
      }

      let from = { x: this.from.x, y: this.from.y }
      let to = { x: this.to.x, y: this.to.y }

      const lenWithTrim = fullLen - 2 * this.trim
      if (lenWithTrim < this.minLength) {
        const missingLen = this.minLength - lenWithTrim
        from.x -= (missingLen / 2) * direction.x
        from.y -= (missingLen / 2) * direction.y
        to.x += (missingLen / 2) * direction.x
        to.y += (missingLen / 2) * direction.y
      }

      from.x += this.trim * direction.x
      from.y += this.trim * direction.y
      to.x -= this.trim * direction.x
      to.y -= this.trim * direction.y

      const signedSize = delta(from, to)
      const len = length(signedSize)

      const angle = !signedSize.x ? 0 : Math.atan2(
        signedSize.y, signedSize.x
      )
      const moveToFrom = `translate(${from.x}px, ${from.y}px)`
      const rotateToTo = `rotate(${angle}rad)`

      const normalOffset = this.normalOffset

      return {
        'transform-origin': 'bottom left',
        transform: `translateY(-100%) ${moveToFrom} ${rotateToTo} translateY(${normalOffset})`,
        width: `${len}px`
      }
    }
  }
}

function isPoint (obj) {
  return typeof obj === 'object' &&
    typeof obj.x === 'number' &&
    typeof obj.y === 'number'
}

</script>

<template>
  <article
    class="arrow"
    :style="arrowStyle"
  >
    <header>
      <slot></slot>
    </header>
  </article>
</template>

<style lang="scss">
$arrow-thickness: 0.1em;
$arrow-color: black;
$arrow-width: 0.6em;
$arrow-height: 0.3em;

.arrow {
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: $arrow-thickness solid $arrow-color;
  //transform: translateY(-50%);

  header {
    text-align: center;
    // Abbreviate the text if not enough space
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8em;
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
