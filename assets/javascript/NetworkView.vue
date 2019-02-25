<script>
/**
 * Visualizes the currently edited network.
 */
export default {
  name: 'network-view',
  data: function () {
    return {
      selectedIndex: null,
      /** Index currently held at the pointer */
      palm: null,
      /** Grabbed element */
      palmEl: null,
      lastGrabPosition: null,
      states: [
        {
          name: "ring",
          network: {
            position: {
              x: 0,
              y: 10
            }
          }
        },
        {
          name: "countdown",
          network: {
            position: {
              x: 500,
              y: 10
            }
          }
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    grab (idx) {
      this.select(idx)
      this.startGrab(idx)
    },
    select (idx) {
      this.selectedIndex = idx
    },
    startGrab (idx, position, el) {
      this.palm = idx
      this.palmEl = el
      this.lastGrabPosition = position
    },
    endGrab () {
      this.palm = null
      this.lastGrabPosition = null
    },
    continueGrab (nextGrabPosition) {
      const moveDistance = delta(this.lastGrabPosition, nextGrabPosition)
      if (moveDistance.x === 0 && moveDistance.y === 0) {
        // Moved not even a single pixel, stop
        return
      }

      const palmElPos = this.position(this.palm)
      const movedPos = translate(
        palmElPos,
        moveDistance
      )

      palmElPos.x = Math.max(0, movedPos.x)
      palmElPos.y = Math.max(0, movedPos.y)

      this.lastGrabPosition = nextGrabPosition
    },
    canDragPalmTo (targetPos) {
      const sourcePos = this.position(this.palm)

    },
    move (evt) {
      if (this.palm !== null) {
        const released = evt.buttons === 0

        if (released) {
          this.endGrab ()
        } else {
          const pos = this.evtPosition (evt)
          this.continueGrab (pos)
        }
      }
    },
    down (idx, evt) {
      const pos = this.evtPosition (evt)
      const el = evt.target
      this.startGrab(idx, pos, el)
    },
    position (idx) {
      return this.states[idx].network.position
    },
    changeName (idx, newName) {
      this.states[idx].name = newName
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

      this.states.push({
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
             :key="idx"
             v-bind:style="{ left: state.network.position.x, top: state.network.position.y }"
             v-bind:tabindex="10000 + idx"
             v-on:focus="select(idx)"
             v-on:mousedown="down(idx, $event)">
      <header contenteditable="true"
              v-on:blur="changeName(idx, $event.target.innerText)"
              v-on:keyup="changeName(idx, $event.target.innerText)"
              v-on:paste="changeName(idx, $event.target.innerText)"
              v-on:input="changeName(idx, $event.target.innerText)">{{state.name}}</header>
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
}
</style>
