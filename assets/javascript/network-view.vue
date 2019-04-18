<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { CONTINUE_RENAME_STATE } from './action-types.js'
import { ADD_STATE, FOCUS_STATE, MOVE_STATE } from './mutation-types.js'

/**
 * Visualizes the currently edited network.
 */
export default {
  name: 'network-view',
  data: function () {
    return {
      palmEl: null,
      firstGrabPosition: null,
      lastGrabPosition: null,
    }
  },
  computed: {
    ...mapState(['states', 'focusedStateId']),
    ...mapGetters(['focusedState', 'isFocused', 'stateNamed']),
    movedPos() {
      if (!this.firstGrabPosition || !this.focusedStateId) {
        return undefined
      }

      const moveDistance = delta(this.firstGrabPosition, this.lastGrabPosition)

      const palmElPos = this.palmEl.getBoundingClientRect()
      const movedPos = translate(
        this.focusedState.network.position,
        moveDistance
      )

      movedPos.x = Math.max(0, movedPos.x)
      movedPos.y = Math.max(0, movedPos.y)

      return movedPos
    }
  },
  methods: {
    ...mapMutations([ ADD_STATE, FOCUS_STATE, MOVE_STATE ]),
    ...mapActions([ CONTINUE_RENAME_STATE ]),
    select (id) {
      this[FOCUS_STATE](id)
    },
    startGrab (position, el) {
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
      this[MOVE_STATE]({ id: this.focusedStateId, to: this.movedPos })
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
      const pos = this.evtPosition (evt)
      const el = evt.target
      this.startGrab(id, pos, el)
      this.select(id)
      this.startGrab(pos, el)
    },
    typed (evt) {
      this[CONTINUE_RENAME_STATE]({
        id: this.focusedStateId,
        to: evt.target.innerText
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
        name: "New state",
        network: { position }
      })
    },
    /** Position of a mouse event relative to this.$el */
    evtPosition (evt) {
      return {
        x: evt.pageX - this.$el.offsetParent.offsetLeft,
        y: evt.pageY - this.$el.offsetParent.offsetTop
      }
    }
  },
}

function evtPosition (evt) {
  return {
    x: evt.pageX,
    y: evt.pageY
  }
}

function translate (pos, delta) {
  return {
    x: pos.x + delta.x,
    y: pos.y + delta.y,
  }
}

function delta (pos0, pos1) {
  return {
    x: pos1.x - pos0.x,
    y: pos1.y - pos0.y
  }
}

function abs2 (vec) {
  return Math.sqrt
}
</script>

<template>
  <section class="network-view" v-on:mousemove="move" v-on:dblclick="insert">
    <article class="network-view-state"
             v-for="(state, idx) in states"
             :key="state.id"
             v-bind:class="{ 'is-focused': isFocused(state) }"
             v-bind:style="{ left: state.network.position.x, top: state.network.position.y }"
             v-bind:tabindex="10000 + idx"
             v-bind:autofocus="isFocused(state) ? 'autofocus' : ''"
             v-on:focus="select(state.id)"
             v-on:mousedown="down(state.id, $event)">
      <header contenteditable="true"
              v-on:blur="typed"
              v-on:keyup="typed"
              v-on:paste="typed"
              v-on:input="typed">{{state.name}}</header>
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


  &.is-focused {
    font-style: italic;
  }
}
</style>
