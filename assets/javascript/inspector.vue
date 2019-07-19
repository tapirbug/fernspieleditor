<script>
import { CONTINUE_UPDATE_STATE } from './action-types.js'
import { REMOVE_TRANSITION, REMOVE_STATE, MAKE_INITIAL_STATE } from './mutation-types.js'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import TransitionDialog from './transition-dialog.vue'

/**
 * Editor for the currently focused element.
 */
export default {
  name: 'Inspector',
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
      'isAny',
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
    change (evt, id, prop) {
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
        id,
        [prop]: value
      })
    },
    removeTransition (summary) {
      this[REMOVE_TRANSITION](summary)
    },
    removeState () {
      this[REMOVE_STATE](this.focusedStateId)
    },
    toggleActiveClass (when) {
      return {
        'is-active': !!when,
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
  <article class="auxiliary-editor inspector">
    <div
      v-if="nothingFocused"
      class="inspector-passive-msg"
    >
      <p>Click on a state to focus it.</p>
      <p>Double click to add a new state.</p>
      <p>Drag with your mouse to move.</p>
    </div>
    <div v-if="focusedState">
      <header>
        <h2>{{ focusedState.name }}</h2>
      </header>

      <h3>Properties</h3>
      <input
        v-if="!isAny(focusedStateId)"
        class="stack"
        placeholder="Name"
        maxlength="32"
        :value="focusedState.name"
        @blur="change($event, focusedStateId, 'name')"
        @keyup="change($event, focusedStateId, 'name')"
        @paste="change($event, focusedStateId, 'name')"
        @input="change($event, focusedStateId, 'name')"
      >
      <input
        class="stack"
        placeholder="Description"
        :value="focusedState.description"
        @blur="change($event, focusedStateId, 'description')"
        @keyup="change($event, focusedStateId, 'description')"
        @paste="change($event, focusedStateId, 'description')"
        @input="change($event, focusedStateId, 'description')"
      >
      <textarea
        v-if="!isAny(focusedStateId)"
        class="stack inspector-input-speech"
        placeholder="Speech"
        :value="focusedState.speech"
        @blur="change($event, focusedStateId, 'speech')"
        @keyup="change($event, focusedStateId, 'speech')"
        @paste="change($event, focusedStateId, 'speech')"
        @input="change($event, focusedStateId, 'speech')"
      ></textarea>
      <input
        v-if="!isAny(focusedStateId)"
        class="stack"
        type="number"
        min="0"
        max="5"
        step="0.25"
        placeholder="Ring time"
        :value="focusedState.ring"
        @blur="change($event, focusedStateId, 'ring')"
        @keyup="change($event, focusedStateId, 'ring')"
        @paste="change($event, focusedStateId, 'ring')"
        @input="change($event, focusedStateId, 'ring')"
      >
      <label
        v-if="!isAny(focusedStateId)"
        class="stack"
      >
        <span
          class="inspector-initial-button toggle button"
          :class="toggleActiveClass(isInitial(focusedStateId))"
        >Initial state</span>
        <input
          type="checkbox"
          :checked="isInitial(focusedStateId)"
          @input="setInitial($event)"
        >
      </label>
      <label
        v-if="!isAny(focusedStateId)"
        class="stack"
      >
        <span
          class="inspector-terminal-button toggle button"
          :class="toggleActiveClass(focusedState.terminal)"
        >Terminal state</span>
        <input
          type="checkbox"
          :value="focusedState.terminal"
          @input="change($event, focusedStateId, 'terminal')"
        >
      </label>

      <article
        v-if="!isAny(focusedStateId)"
        class="inspector-actions"
      >
        <header><h3>Actions</h3></header>
        <footer>
          <button
            class="dangerous"
            @click="removeState"
          >
            Delete state
          </button>
        </footer>
      </article>

      <h3>Transitions</h3>
      <article
        v-for="transition in transitionSummariesFrom(focusedStateId)"
        :key="JSON.stringify(transition)"
        class="card"
      >
        <header>
          <div class="inspector-transition-summary flex two">
            <div class="inspector-transition-summary-text">
              <span v-text="transition.when"></span>
              to
              <span v-text="transition.toName"></span>
            </div>
            <div class="inspector-modify-transition-btns">
              <button
                class="dangerous"
                @click="removeTransition(transition)"
              >
                Delete
              </button>
            </div>
          </div>
        </header>
      </article>
      <article
        v-for="transition in transitionSummariesTo(focusedStateId)"
        :key="JSON.stringify(transition)"
        class="card"
      >
        <header>
          <div class="inspector-transition-summary flex two">
            <div class="inspector-transition-summary-text">
              <span v-text="transition.when"></span>
              from
              <span v-text="transition.fromName"></span>
            </div>
            <div class="inspector-modify-transition-btns">
              <button
                class="dangerous"
                @click="removeTransition(transition)"
              >
                Delete
              </button>
            </div>
          </div>
        </header>
      </article>

      <transition name="slide">
        <transition-dialog
          v-if="addingTransition"
          :from="focusedStateId"
          @addtransitiondone="addingTransition = false"
        ></transition-dialog>
      </transition>

      <div class="inspector-add-transition-btns">
        <button
          :disabled="addingTransition"
          @click="addingTransition = true"
        >
          Add transition
        </button>
        <button
          :class="{ warning: addingTransition }"
          :disabled="!addingTransition"
          @click="addingTransition = false"
        >
          Cancel
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="scss">
$inspector-passive-msg-color: #777;
$danger-color: #ff4136;

.inspector {
  position: relative;
  width: 100%;
  height: 100%;
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
  height: 10em;
  word-break: break-all;
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
