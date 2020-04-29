<script>
import { mapMutations, mapGetters } from 'vuex'
import { ADD_TRANSITION } from '../store/mutation-types.js'

/**
 * A floating dialog over a state to add transitions.
 */
export default {
  name: 'TransitionDialog',
  props: {
    from: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      done: false,
      transitionTargetId: null,
      transitionType: null,
      dialNumber: null,
      timeoutSeconds: null,
      allTransitionTypes: {
        dial: 'Dial',
        timeout: 'Timeout',
        pick_up: 'Pick up',
        hang_up: 'Hang up'
      }
    }
  },
  computed: {
    ...mapGetters(['states'])
  },
  methods: {
    ...mapMutations([ADD_TRANSITION]),
    selectTransitionTarget (id) {
      this.transitionTargetId = id
    },
    config () {
      const transitionType = this.transitionType
      if (!transitionType) {
        return
      }

      if (!this.transitionTargetId) {
        return
      }

      const config = (() => {
        if (transitionType === 'dial') {
          if (this.dialNumber === null) {
            return
          }
          const num = this.dialNumber | 0
          if (num < 0 || num > 9) {
            return
          }

          // Dialed number
          return {
            pattern: '' + num
          }
        } else if (transitionType === 'timeout') {
          if (!this.timeoutSeconds) {
            return
          }

          // Timeout
          return {
            after: parseFloat(this.timeoutSeconds)
          }
        } else {
          // pick up or hang up
          return {}
        }
      })()

      if (!config) {
        return
      }

      return {
        type: transitionType,
        from: this.from,
        to: this.transitionTargetId,
        removed: false,
        ...config
      }
    },
    updateTransitionIfComplete (otherwiseFocusSel) {
      this.$nextTick(() => {
        const config = this.config()

        if (!config) {
          this.$el.querySelector(otherwiseFocusSel).click()
        } else {
          this[ADD_TRANSITION](config)
          this.$emit('addtransitiondone', config)
        }
      })
    }
  }
}
</script>

<template>
  <section
    v-if="!done"
    class="transition-dialog"
  >
    <div class="transition-dialog-tabs tabs two">
      <input
        id="tab-1"
        type="radio"
        name="tabgroupB"
        checked
      >
      <label
        class="pseudo button toggle"
        for="tab-1"
      >When</label>

      <input
        id="tab-2"
        type="radio"
        name="tabgroupB"
      >
      <label
        class="pseudo button toggle"
        for="tab-2"
      >To</label>

      <div class="row transition-dialog-tabs-contents">
        <div>
          <section class="transition-dialog-condition">
            <div class="flex two">
              <div>
                <input
                  v-model="dialNumber"
                  type="number"
                  class="stack"
                  placeholder="0-9"
                  title="Number to dial for the transition"
                  min="0"
                  max="9"
                >
                <input
                  v-model="timeoutSeconds"
                  type="number"
                  class="stack"
                  placeholder="0.5"
                  title="Timeout in seconds"
                  min="0"
                  max="3600"
                  step="0.1"
                >
              </div>
              <div>
                <label
                  v-for="(availableName, availableId) in allTransitionTypes"
                  :key="availableId"
                  class="stack pseudo button toggle"
                >
                  {{ availableName }}
                  <input
                    v-model="transitionType"
                    :value="availableId"
                    type="radio"
                    @click="updateTransitionIfComplete('#tab-2')"
                  >
                </label>
              </div>
            </div>
          </section>
        </div>

        <div>
          <section class="transition-dialog-state-selection">
            <label
              v-for="(state, id) in states"
              :key="`${id}-label`"
              class="stack pseudo button toggle"
              @change="updateTransitionIfComplete('#tab-1')"
            >
              {{ state.name }}
              <input
                v-model="transitionTargetId"
                :value="id"
                type="radio"
              >
            </label>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@use "../../style/variables/layout";

.transition-dialog {
  &-condition > div {
    margin: 0;
    padding: 0;
  }

  &-state-selection {
    margin: 0 !important; /* override picnic CSS selector with higher specificity */
    padding-bottom: 0.6em !important; /* override picnic CSS selector with higher specificity */
    max-height: layout.$dialog-height;
    overflow: auto !important; /* override picnic CSS selector with higher specificity */
  }

  &-tabs {
    text-align: center;
  }

  .card {
    margin: 0
  }
}

.transition-dialog-tabs-contents {
  margin-top: 0.6em !important; /* override picnic CSS selector with higher specificity */
  margin-bottom: 0.9em !important; /* override picnic CSS selector with higher specificity */
}
</style>
