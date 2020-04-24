<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { CONTINUE_UPDATE_STATE } from '../store/action-types.js'
import { ADD_STATE, FOCUS_STATE, MOVE_STATE } from '../store/mutation-types.js'
import {
  delta,
  distance
} from '../util/geom/points.js'
import { translate } from '../util/geom/transform.js'
import { intersectRayWithEllipse, connectEllipses } from '../util/geom/ellipses.js'
import Arrow from './arrow.vue'
import uuid from '../util/random/uuid.js'
import { mapValues } from '../util/map-obj.js'

/**
 * Visualizes the currently edited network.
 */
export default {
  name: 'NetworkView',
  components: {
    'arrow': Arrow
  },
  data: function () {
    return {
      palmId: null,
      palmEl: null,
      firstGrabPosition: null,
      lastGrabPosition: null,
      stateSizes: {}
    }
  },
  computed: {
    ...mapGetters([
      'allStates',
      'states',
      'stateIds',
      'findNetwork',
      'findState',
      'focusedState',
      'isFocused',
      'isAny',
      'isRemoved',
      'transitionSummariesFrom',
      'transitionSummariesTo',
      'isStateActiveOnRemote'
    ]),
    movedPos () {
      if (!this.firstGrabPosition || !this.palmId || !this.findNetwork(this.palmId)) {
        return undefined
      }

      const moveDistance = delta(this.firstGrabPosition, this.lastGrabPosition)

      const movedPos = translate(
        this.findNetwork(this.palmId).position,
        moveDistance
      )

      movedPos.x = Math.max(0, movedPos.x)
      movedPos.y = Math.max(0, movedPos.y)

      return movedPos
    },
    arrows () {
      this.updateStateSizes()

      const transitionEdges = Object.keys(this.states)
        .map(this.transitionSummariesFrom)
        .reduce((a, b) => { a.push(...b); return a }, []) // flatten
        .sort(byFromAndThenTo)

      const arrows = transitionEdges.reduce(
        appendArrow,
        []
      )
        .map(
          arrow => {
            const fromPos = this.palmId === arrow.from ? this.movedPos : this.findNetwork(arrow.from).position
            const toPos = arrow.isToSelf ? fromPos : (this.palmId === arrow.to ? this.movedPos : this.findNetwork(arrow.to).position)
            const fromSize = this.stateSize(arrow.from)

            const positions = (() => {
              if (arrow.isToSelf) {
                return arrowThroughSingleEllipse(fromPos, fromSize)
              } else {
                const toSize = this.stateSize(arrow.to)
                const { from, to } = connectEllipses(
                  { ...fromPos, ...fromSize },
                  { ...toPos, ...toSize }
                )
                if (from === null || to === null) {
                  throw new Error(`from = ${from}, to = ${to}`)
                }
                return { fromPos: from, toPos: to }
              }
            })()

            return {
              ...arrow,
              ...positions
            }
          },
          this
        )

      return arrows

      function byFromAndThenTo (a, b) {
        const valA = a.from + a.to
        const valB = b.from + b.to
        if (valA < valB) {
          return -1
        }
        if (valA > valB) {
          return 1
        }
        return 0
      }

      function appendArrow (arrows, nextTransition) {
        const lastArrow = (arrows.length === 0) ? false : arrows[arrows.length - 1]

        if (lastArrow && lastArrow.from === nextTransition.from && lastArrow.to === nextTransition.to) {
          lastArrow.label += ', ' + nextTransition.when
        } else {
          const isToSelf = nextTransition.from === nextTransition.to
          const hasInverse = isToSelf || transitionEdges.findIndex(
            transition => transition.from === nextTransition.to && transition.to === nextTransition.from
          ) !== -1

          arrows.push({
            fromName: nextTransition.fromName,
            toName: nextTransition.toName,
            from: nextTransition.from,
            to: nextTransition.to,
            label: nextTransition.when,
            isToSelf,
            hasInverse
          })
        }

        return arrows
      }

      function arrowThroughSingleEllipse (fromPos, fromSize) {
        const slope = 0.03
        const through = translate(fromPos, { x: 0, y: -fromSize.height * 0.25 })
        const left = intersectRayWithEllipse(
          through,
          {
            x: -1,
            y: -slope
          },
          {
            ...fromPos,
            ...fromSize
          }
        )

        const right = intersectRayWithEllipse(
          through,
          {
            x: 1,
            y: slope
          },
          {
            ...fromPos,
            ...fromSize
          }
        )

        return {
          fromPos: left,
          toPos: right
        }
      }
    }
  },
  mounted () {
    this.updateStateSizes()
  },
  methods: {
    ...mapMutations([ ADD_STATE, FOCUS_STATE, MOVE_STATE ]),
    ...mapActions([ CONTINUE_UPDATE_STATE ]),
    /**
     * State IDs mapped against their sizes in pixels.
     */
    updateStateSizes () {
      this.stateSizes = mapValues(
        this.$refs,
        child => {
          if (!child || child.length === 0) {
            return {
              width: 0,
              height: 0
            }
          } else {
            return {
              width: child[0].getBoundingClientRect().width || 0,
              height: child[0].getBoundingClientRect().height || 0
            }
          }
        },
        {}
      )
    },
    stateSize (id) {
      if (id in this.stateSizes) {
        return this.stateSizes[id]
      } else {
        // fallback size for the time until the first layout
        // is available
        return {
          width: 109,
          height: 109
        }
      }
    },
    select (id) {
      this[FOCUS_STATE](id)
    },
    deselect () {
      this[FOCUS_STATE](undefined)
    },
    startGrab (id, position, el) {
      this.palmId = id
      this.palmEl = el
      this.firstGrabPosition = position
      this.lastGrabPosition = position
    },
    continueGrab (nextGrabPosition) {
      if (!this.firstGrabPosition || !this.palmEl) {
        return
      }

      this.lastGrabPosition = nextGrabPosition

      // Only move visually, commit at the end of the grab
      this.movePalm(this.movedPos)
    },
    movePalm (to) {
      if (to) {
        this.palmEl.style.left = to.x + 'px'
        this.palmEl.style.top = to.y + 'px'
      }
    },
    endGrab () {
      const from = this.findNetwork(this.palmId).position
      const to = this.movedPos

      const minimumMoveDistance = 3

      if (distance(from, to) > minimumMoveDistance) {
        // significant move, do it
        this.movePalm(to)
        this[MOVE_STATE]({ id: this.palmId, from, to })
      } else {
        // did scarcely move, undo it
        this.movePalm(from)
      }

      this.palmId = null
      this.palmEl = null
      this.firstGrabPosition = null
      this.lastGrabPosition = null
    },
    move (evt) {
      if (this.lastGrabPosition) {
        const released = evt.buttons === 0

        if (released) {
          this.endGrab()
        } else {
          const pos = this.evtPosition(evt)
          this.continueGrab(pos)
        }
      }
    },
    down (id, evt) {
      const el = evt.target.classList.contains('network-view-state')
        ? evt.target
        : evt.target.classList.contains('network-view-state-name') ? evt.target.parentElement : false

      if (!el) {
        return
      }

      const pos = this.evtPosition(evt)
      this.startGrab(id, pos, el)
      this.select(id)
    },
    typed (evt, id) {
      const oldVal = this.findState(id).name
      const newVal = evt.target.innerText
      if (oldVal !== newVal) {
        this[CONTINUE_UPDATE_STATE]({
          id,
          change: { name: newVal },
          changeBack: { name: oldVal }
        })
      }
    },
    insert (evt) {
      if (!evt.target.classList.contains('network-view')) {
        // Did not click on the background, but on something in the foregrond, stop.
        return
      }

      const insertionOffsetToPtr = {
        x: -40,
        y: -40
      }
      const position = this.evtPosition(evt)
      position.x += insertionOffsetToPtr.x
      position.y += insertionOffsetToPtr.y

      this[ADD_STATE]({
        id: uuid(),
        state: {
          name: 'New state'
        },
        position
      })
    },
    /** Position of a mouse event relative to this.$el */
    evtPosition (evt) {
      return {
        x: evt.pageX - this.$el.offsetParent.offsetLeft,
        y: evt.pageY - this.$el.offsetParent.offsetTop
      }
    },
    stateStyle (id) {
      const removed = this.isRemoved(id)
      const network = this.findNetwork(id)
      const position = network ? network.position : { x: 0, y: 0 }
      return {
        left: position.x,
        top: position.y,
        opacity: removed ? 0 : 1
      }
    },
    stateClasses (id) {
      return {
        'is-focused': this.isFocused(id),
        'is-any': this.isAny(id),
        'is-active-on-connected': this.isStateActiveOnRemote(id)
      }
    }
  }
}
</script>

<template>
  <section
    class="network-view"
    @mousemove="move"
    @dblclick="insert"
    @click="deselect"
  >
    <article
      v-for="(state, id) in allStates"
      :key="id"
      :ref="id"
      class="network-view-state"
      :class="stateClasses(id)"
      :style="stateStyle(id)"
      :tabindex="0"
      :autofocus="isFocused(id) ? 'autofocus' : ''"
      @focus="select(id)"
      @mousedown="down(id, $event)"
      @click="$event.stopPropagation()"
    >
      <header
        class="network-view-state-name is-selectable"
        contenteditable="true"
        @focus="select(id)"
        @blur="typed($event, id)"
        @focusout="typed($event, id)"
        @keydown.tab="typed($event, id)"
        v-text="state.name"
      ></header>
    </article>

    <arrow
      v-for="arrow in arrows"
      :key="'arrow-' + arrow.from + arrow.to"
      :from="arrow.fromPos"
      :to="arrow.toPos"
      :normal-offset="arrow.offset"
      :trim="0"
    >
      {{ arrow.label }}
    </arrow>
  </section>
</template>

<style lang="scss">
@use "../../style/variables/colors";
@use "../../style/variables/layers";

$state-border: 0.07em solid black;
$state-bg: #fafafa;

// state is not active on remote
$active-shadow-inactive: 0 0 0 colors.$network-active-state;
$active-shadow-active-minimum: 0 0 0.6em colors.$network-active-state;
$active-shadow-active-maximum: 0 0 1.4em colors.$network-active-state;

.network-view {
  width: 100%;
  height: 100%;
  padding-top: 0.5em;
  position: relative;
}

.network-view-state {
  position: absolute;
  padding: 2em;
  border: $state-border;
  border-radius: 100%;
  display: inline-block;
  background-color: $state-bg;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

  transform: translate(-50%, -50%);
  color: colors.$network-unselected-text;
  // unselected states are below selected states
  z-index: layers.$unselected-state;

  &.is-focused {
    z-index: layers.$selected-state;
    .network-view-state-name {
      color: colors.$network-selected-text;
      text-shadow: lighten(colors.$network-selected-text, 44%) 1px 1px 10px;
    }
  }

  &.is-any {
    background-color: colors.$network-any-state;
  }

  &.is-active-on-connected {
    box-shadow: $active-shadow-inactive;
    animation: pulsate 1.15s ease-out infinite;
  }
}

@keyframes pulsate {
  0%   { box-shadow: $active-shadow-active-minimum; }
  50%  { box-shadow: $active-shadow-active-maximum; }
  100% { box-shadow: $active-shadow-active-minimum; }
}
</style>
