<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { CONTINUE_UPDATE_STATE } from './action-types.js'
import { ADD_STATE, FOCUS_STATE, MOVE_STATE } from './mutation-types.js'
import { evtPosition, translate, delta } from './points.js'
import Vue from 'vue'

/**
 * Visualizes the currently edited network.
 */
export default {
  name: 'network-view',
  data: function () {
    return {
      palmId: null,
      palmEl: null,
      firstGrabPosition: null,
      lastGrabPosition: null,
    }
  },
  computed: {
    ...mapState(['states']),
    ...mapGetters(['findNetwork', 'focusedState', 'isFocused', 'stateNamed']),
    movedPos() {
      if (!this.firstGrabPosition || !this.palmId || !this.findNetwork(this.palmId)) {
        return undefined
      }

      const moveDistance = delta(this.firstGrabPosition, this.lastGrabPosition)

      const palmElPos = this.palmEl.getBoundingClientRect()
      const movedPos = translate(
        this.findNetwork(this.palmId).position,
        moveDistance
      )

      movedPos.x = Math.max(0, movedPos.x)
      movedPos.y = Math.max(0, movedPos.y)

      return movedPos
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
    movePalm(to) {
      if (to) {
        this.palmEl.style.left = to.x + "px"
        this.palmEl.style.top = to.y + "px" 
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
          this.endGrab ()
        } else {
          const pos = this.evtPosition (evt)
          this.continueGrab (pos)
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

      const pos = this.evtPosition (evt)
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
          name: "New state",
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
  },
}
</script>

<template>
  <section class="network-view" v-on:mousemove="move" v-on:dblclick="insert" v-on:click="deselect">
    <article class="network-view-state"
             v-for="(state, id) in states"
             :key="id"
             v-bind:class="{ 'is-focused': isFocused(id) }"
             v-bind:style="stateStyle(id)"
             v-bind:tabindex="0"
             v-bind:autofocus="isFocused(id) ? 'autofocus' : ''"
             v-on:focus="select(id)"
             v-on:mousedown="down(id, $event)"
             v-on:click="$event.stopPropagation()">

      <header class="network-view-state-name"
              contenteditable="true"
              v-on:focus="select(id)"
              v-on:blur="typed($event, id)"
              v-on:focusout="typed($event, id)"
              v-on:keydown.tab="typed($event, id)"
              v-text="state.name"></header>
    </article>
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


  &.is-focused .network-view-state-name {
    font-style: italic;
  }
}
</style>
