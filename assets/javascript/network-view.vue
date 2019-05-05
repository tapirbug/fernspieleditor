<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { CONTINUE_UPDATE_STATE } from './action-types.js'
import { ADD_STATE, FOCUS_STATE, MOVE_STATE } from './mutation-types.js'
import { translate, delta } from './points.js'
import Arrow from './arrow.vue'

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
      lastGrabPosition: null
    }
  },
  computed: {
    ...mapState(['states']),
    ...mapGetters([
      'findNetwork',
      'focusedState',
      'isFocused',
      'stateNamed',
      'transitionSummariesFrom',
      'transitionSummariesTo'
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
            return {
              ...arrow,
              fromPos,
              toPos: arrow.isToSelf
                ? { x: toPos.x + 10, y: toPos.y + 5 }
                : toPos,
              offset: arrow.isToSelf ? '-2em' : (arrow.hasInverse ? '-0.3em' : '0')
            }
          }
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
    }
  },
  methods: {
    ...mapMutations([ ADD_STATE, FOCUS_STATE, MOVE_STATE ]),
    ...mapActions([ CONTINUE_UPDATE_STATE ]),
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
      this.movePalm(this.movedPos)
      this[MOVE_STATE]({ id: this.palmId, to: this.movedPos })
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
      this[CONTINUE_UPDATE_STATE]({
        id,
        name: evt.target.innerText
      })
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
      const network = this.findNetwork(id)
      const position = network ? network.position : { x: 0, y: 0 }
      return {
        left: position.x,
        top: position.y
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
      v-for="(state, id) in states"
      :key="id"
      class="network-view-state"
      :class="{ 'is-focused': isFocused(id) }"
      :style="stateStyle(id)"
      :tabindex="0"
      :autofocus="isFocused(id) ? 'autofocus' : ''"
      @focus="select(id)"
      @mousedown="down(id, $event)"
      @click="$event.stopPropagation()"
    >
      <header
        class="network-view-state-name"
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
    >
      {{ arrow.label }}
    </arrow>
  </section>
</template>

<style lang="scss">
$state-border: 0.07em solid black;
$state-bg: #fafafa;

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

  &.is-focused .network-view-state-name {
    font-style: italic;
  }
}
</style>
