<script>
import { CONTINUE_UPDATE_STATE } from './action-types.js'
import { mapGetters, mapActions } from 'vuex'

/**
 * Editor for the currently focused element.
 */
export default {
  name: 'inspector',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['focusedState']),
    nothingFocused () {
      return !this.focusedState
    }
  },
  methods: {
    ...mapActions([CONTINUE_UPDATE_STATE]),
    change (evt, prop) {
      this[CONTINUE_UPDATE_STATE]({
        id: this.focusedState.id,
        [prop]: evt.target.value
      })
    }
  }
}
</script>

<template>
  <section class="inspector">
    <div class="inspector-passive-msg" v-if="nothingFocused">
      <p>Click on a state to focus it.</p>
      <p>Double click to add a new state.</p>
      <p>Drag with your mouse to move.</p>
    </div>
    <div v-if="focusedState">
      <header>
        <h2>{{focusedState.name}}</h2>
      </header>

      <h3>Properties</h3>
      <input class="stack"
             placeholder="Name"
             maxlength="32"
             v-bind:value="focusedState.name"
             v-on:blur="change($event, 'name')"
             v-on:keyup="change($event, 'name')"
             v-on:paste="change($event, 'name')"
             v-on:input="change($event, 'name')" />
      <input class="stack"
             placeholder="Description"
             v-bind:value="focusedState.description"
             v-on:blur="change($event, 'description')"
             v-on:keyup="change($event, 'description')"
             v-on:paste="change($event, 'description')"
             v-on:input="change($event, 'description')" />
      <textarea class="stack inspector-input-speech" placeholder="Speech"
             v-text="focusedState.speech"
             v-on:blur="change($event, 'speech')"
             v-on:keyup="change($event, 'speech')"
             v-on:paste="change($event, 'speech')"
             v-on:input="change($event, 'speech')"></textarea>

      <h3>Debug</h3>
      <dl>
        <dt>ID</dt>
        <dd>{{focusedState.id}}</dd>
      </dl>
    </div>
  </section>
</template>

<style lang="scss">
$inspector-passive-msg-color: #777;

.inspector {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 0.6em;
}

.inspector-passive-msg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: $inspector-passive-msg-color;
}

.inspector-input-speech {
  resize: vertical;
}
</style>
