<script>
import { mapState, mapMutations } from 'vuex'
import { ADD_TRANSITION } from './mutation-types.js'

/**
 * A floating dialog over a state to add transitions.
 */
export default {
  name: 'transition-dialog',
  props: ['from'],
  data () {
    return {
      done: false,
      transitionTargetId: null,
      transitionType: null,
      dialNumber: null,
      timeoutSeconds: null,
      allTransitionTypes: {
        dial: 'Dial',
        timeout: 'Timeout'
      }
    }
  },
  computed: {
    ...mapState(['states']),
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
          const num = this.dialNumber|0
          if (num < 0 || num > 9) {
            return
          }

          // Dialed number
          return {
            [num]: this.transitionTargetId
          }
        } else {
          if (!this.timeoutSeconds) {
            return
          }

          // Timeout
          return {
            to: this.transitionTargetId,
            after: parseFloat(this.timeoutSeconds),
          }
        }
      })()

      if (!config) {
        return
      }

      return {
        transitionType,
        from: this.from,
        ...config
      }
    },
    updateTransitionIfComplete(otherwiseFocusSel) {
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
  },
}
</script>

<template>
  <section class="transition-dialog" v-if="!done">

    <div class="transition-dialog-tabs tabs two">
      <input id="tab-1" type="radio" name="tabgroupB" checked>
      <label class="pseudo button toggle" for="tab-1">When</label>

      <input id="tab-2" type="radio" name="tabgroupB" />
      <label class="pseudo button toggle" for="tab-2">To</label>

      <div class="row transition-dialog-tabs-contents">

        <div>
          <section class="transition-dialog-condition">
            <div class="flex two">
              <div>
                <input v-model="dialNumber" type="number" class="stack" placeholder="0-9" title="Number to dial for the transition" min="0" max="9" />
                <input v-model="timeoutSeconds" type="number" class="stack" placeholder="0.5" title="Timeout in seconds" min="0" max="3600" step="0.1" />
              </div>
              <div>
                <label v-for="(availableName, availableId) in allTransitionTypes" :key="availableId"
                        class="stack pseudo button toggle">
                        {{availableName}}
                        <input v-bind:value="availableId"
                              type="radio"
                              v-on:click="updateTransitionIfComplete('#tab-2')"
                              v-model="transitionType"/>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div>
          <section class="transition-dialog-state-selection">
            <label v-for="state in states" :key="`${state.id}-label`"
                    v-on:change="updateTransitionIfComplete('#tab-1')"
                    class="stack pseudo button toggle">
                    {{state.name}}
                    <input v-bind:value="state.id"
                          type="radio"
                          v-model="transitionTargetId"/>
            </label>
          </section>
        </div>

      </div>
    </div>

  </section>
</template>

<style lang="scss">
$dialog-height: 10em;

.transition-dialog {
  &-condition > div {
    margin: 0;
    padding: 0;
  }

  &-state-selection {
    margin: 0 !important; /* override picnic CSS selector with higher specificity */
    padding-bottom: 0.6em !important; /* override picnic CSS selector with higher specificity */
    max-height: $dialog-height;
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
