<script>
/**
 * Tab view.
 */
export default {
  name: 'TabView',
  props: {
    labels: {
      type: Array,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      selected: 0
    }
  },
  computed: {
    contentContainerStyle: function () {
      return {
        width: `${this.labels.length * 100}%`,
        transform: `translateX(${(-100 / this.labels.length) * this.selected}%)`
      }
    },
    contentElementStyle: function () {
      return {
        width: `${100 / Math.max(1, this.labels.length)}%`
      }
    }
  },
  methods: {
  }
}
</script>

<template>
  <section class="tab-view">
    <header class="tab-view-selects">
      <label
        v-for="(label, index) in labels"
        :key="`label-${index}-${label.id}`"
      >
        <input
          v-model="selected"
          type="radio"
          name="tab-view-select"
          :value="index"
          checked
        >
        <span
          class="toggle pseudo button"
          v-text="label.title"
        ></span>
      </label>
    </header>

    <div class="tab-view-contents">
      <div
        class="tab-view-contents-inner"
        :style="contentContainerStyle"
      >
        <div
          v-for="(label, index) in labels"
          :key="`content-${index}-${label.id}`"
          class="tab-view-content"
          :style="contentElementStyle"
        >
          <slot :name="label.id">
            Content of {{ label.title }}.
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.tab-view-selects {
  text-align: center;
}

.tab-view-contents {
  width: 100%;
  overflow: hidden;
}

.tab-view-content {
  position: relative;
  width: 100%;
  height: 100%;
  white-space: normal;
}

.tab-view-contents-inner {
  white-space: nowrap;
  display: flex;
  transition: transform ease 0.3s;
}
</style>
