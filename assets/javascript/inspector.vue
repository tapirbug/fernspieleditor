<script>
import { CONTINUE_UPDATE_STATE } from './action-types.js'
import { REMOVE_TRANSITION } from './mutation-types.js'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import TransitionDialog from './transition-dialog.vue'

/**
 * Editor for the currently focused element.
 */
export default {
  name: 'inspector',
  components: {
    'transition-dialog': TransitionDialog
  },
  data () {
    return {
      addingTransition: false
    }
  },
  computed: {
    ...mapGetters(['focusedState', 'transitionSummariesFrom']),
    nothingFocused () {
      return !this.focusedState
    }
  },
  methods: {
    ...mapMutations([REMOVE_TRANSITION]),
    ...mapActions([CONTINUE_UPDATE_STATE]),
    change (evt, prop) {
      const value = (prop === 'ring')
        ? parseFloat(evt.target.value)
        : evt.target.value

      this[CONTINUE_UPDATE_STATE]({
        id: this.focusedState.id,
        [prop]: value
      })
    },
    removeTransition(summary) {
      this[REMOVE_TRANSITION](summary)
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
      <input class="stack"
             type="number"
             min="0"
             max="5"
             step="0.25"
             placeholder="Ring time"
             v-bind:value="focusedState.ring"
             v-on:blur="change($event, 'ring')"
             v-on:keyup="change($event, 'ring')"
             v-on:paste="change($event, 'ring')"
             v-on:input="change($event, 'ring')" />

      <h3>Transitions</h3>
      <article class="card" v-for="transition in transitionSummariesFrom(focusedState)"
            :key="transition.when + transition.to">
        <header>
          <div class="inspector-transition-summary flex two">
            <div class="inspector-transition-summary-text">
              <span v-text="transition.when"></span>
              to
              <span v-text="transition.to"></span>
            </div>
            <div class="inspector-modify-transition-btns">
              <button class="dangerous" v-on:click="removeTransition(transition)">Delete</button>
            </div>
          </div>
        </header>
      </article>

      <transition-dialog v-if="addingTransition"
                         v-bind:from="focusedState.id"
                         v-on:addtransitiondone="addingTransition = false"></transition-dialog>

      <div class="inspector-add-transition-btns">

        <button v-on:click="addingTransition = true"
                v-bind:disabled="addingTransition">Add transition</button>
        <button v-bind:class="{ warning: addingTransition }"
                v-bind:disabled="!addingTransition"
                v-on:click="addingTransition = false">Cancel</button>
      </div>

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

.inspector-add-transition-btns {
  text-align: center;
}

.inspector-transition-summary {
  align-items: center;
  justify-content: space-between;
}

.inspector-transition-summary-text {
  margin-top: -0.2em;
  padding-left: 0.5em;
}

.inspector-transition-summary-text,
.inspector-modify-transition-btns {
  padding-bottom: 0 !important;
}

.inspector-modify-transition-btns {
  text-align: right;
  flex-basis: 30%;
}
</style>
