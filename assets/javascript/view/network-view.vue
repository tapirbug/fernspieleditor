<script>
import { data, computed, methods } from './network-view-logic'
import Arrow from './arrow.vue'

/**
 * Visualizes the currently edited network.
 */
export default {
  name: 'NetworkView',
  components: {
    'arrow': Arrow
  },
  data,
  computed,
  mounted () {
    this.updateStateSizes()
  },
  methods
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
      v-for="state in allStates"
      :key="state.id"
      :ref="state.id"
      class="network-view-state"
      :class="stateClasses(state)"
      :style="stateStyle(state)"
      :tabindex="0"
      :autofocus="isFocused(state.id) ? 'autofocus' : ''"
      @focus="select(state.id)"
      @mousedown="down(state.id, $event)"
      @click="$event.stopPropagation()"
    >
      <header
        class="network-view-state-name is-selectable"
        contenteditable="true"
        @focus="select(state.id)"
        @blur="typed($event, state.id)"
        @focusout="typed($event, state.id)"
        @keydown.tab="typed($event, state.id)"
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
