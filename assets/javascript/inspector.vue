<script>
import { CONTINUE_UPDATE_STATE } from './action-types.js'
import { REMOVE_TRANSITION, REMOVE_STATE, MAKE_INITIAL_STATE } from './mutation-types.js'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
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
    ...mapState(['focusedStateId']),
    ...mapGetters([
      'focusedState',
      'isInitial',
      'transitionSummariesFrom',
      'transitionSummariesTo'
    ]),
    nothingFocused () {
      return !this.focusedState
    }
  },
  methods: {
    ...mapMutations([REMOVE_TRANSITION, REMOVE_STATE, MAKE_INITIAL_STATE]),
    ...mapActions([CONTINUE_UPDATE_STATE]),
    change (evt, prop) {
      const value = (() => {
        if (prop === 'ring') {
          return parseFloat(evt.target.value)
        } else if (prop === 'terminal') {
          return !!evt.target.checked
        } else {
          return evt.target.value
        }
      })()

      this[CONTINUE_UPDATE_STATE]({
        id: this.focusedStateId,
        [prop]: value
      })
    },
    removeTransition(summary) {
      this[REMOVE_TRANSITION](summary)
    },
    removeState () {
      this[REMOVE_STATE](this.focusedStateId)
    },
    toggleActiveClass (when) {
      return {
        'is-active': when,
        'is-inactive': !when
      }
    },
    setInitial (evt) {
      this[MAKE_INITIAL_STATE](
        evt.target.checked
          ? this.focusedStateId
          : null
      )
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
      <label class="stack">
        <span class="inspector-initial-button toggle button" v-bind:class="toggleActiveClass(isInitial(focusedStateId))">Initial state</span>
        <input type="checkbox"
             v-bind:checked="isInitial(focusedStateId)"
             v-on:input="setInitial($event)" />
      </label>
      <label class="stack">
        <span class="inspector-terminal-button toggle button" v-bind:class="toggleActiveClass(focusedState.terminal)">Terminal state</span>
        <input type="checkbox"
             v-bind:value="focusedState.terminal"
             v-on:input="change($event, 'terminal')" />
      </label>

      <article class="inspector-actions">
        <header><h3>Actions</h3></header>
        <footer>
          <button class="dangerous" v-on:click="removeState">Delete state</button>
        </footer>
      </article>

      <h3>Transitions</h3>
      <article class="card" v-for="transition in transitionSummariesFrom(focusedStateId)"
            :key="JSON.stringify(transition)">
        <header>
          <div class="inspector-transition-summary flex two">
            <div class="inspector-transition-summary-text">
              <span v-text="transition.when"></span>
              to
              <span v-text="transition.toName"></span>
            </div>
            <div class="inspector-modify-transition-btns">
              <button class="dangerous" v-on:click="removeTransition(transition)">Delete</button>
            </div>
          </div>
        </header>
      </article>
      <article class="card" v-for="transition in transitionSummariesTo(focusedStateId)"
            :key="JSON.stringify(transition)">
        <header>
          <div class="inspector-transition-summary flex two">
            <div class="inspector-transition-summary-text">
              <span v-text="transition.when"></span>
              from
              <span v-text="transition.fromName"></span>
            </div>
            <div class="inspector-modify-transition-btns">
              <button class="dangerous" v-on:click="removeTransition(transition)">Delete</button>
            </div>
          </div>
        </header>
      </article>

      <transition name="slide">
        <transition-dialog v-if="addingTransition"
                          v-bind:from="focusedStateId"
                          v-on:addtransitiondone="addingTransition = false"></transition-dialog>
      </transition>

      <div class="inspector-add-transition-btns">

        <button v-on:click="addingTransition = true"
                v-bind:disabled="addingTransition">Add transition</button>
        <button v-bind:class="{ warning: addingTransition }"
                v-bind:disabled="!addingTransition"
                v-on:click="addingTransition = false">Cancel</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
$inspector-passive-msg-color: #777;
$danger-color: #ff4136;

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
  height: 8em;
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

.inspector-actions {
  .dangerous {
    background-color: $danger-color;
  }

  footer {
    text-align: center;
  }
}

.slide-enter-active, .slide-leave-active {
  transition: max-height 0.2s ease-in;
  max-height: 10em;
  overflow: hidden;
}
.slide-enter, .slide-leave-to {
  max-height: 0;
}

$default-color: #0074d9;
$success-green: #2ecc40;
$error-red: #ff4136;

.inspector-initial-button,
.inspector-terminal-button {
  &.is-inactive {
    background-color: desaturate($default-color, 90%);
  }
}

.inspector-initial-button {
  &.is-active {
    background-color: desaturate($success-green, 30%);
  }
}

.inspector-terminal-button {
  &.is-active {
    background-color: desaturate($error-red, 30%);
  }
}
</style>
