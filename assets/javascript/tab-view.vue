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
      default: () => {},
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
        'margin-left': `${this.selected * -100}%`
      }
    },
    contentElementStyle: function () {
      return {
        width: `${100 / Math.max(1, this.labels.length)}%`
      }
    },
  },
  methods: {
  }
}
</script>

<template>
  <section class="tab-view">
    <header class="tab-view-selects">
      <label v-for="(label, index) in labels" :key="`label-${index}-${label.id}`">
        <input type="radio" name="tab-view-select" v-bind:value="index" v-model="selected" checked>
        <span class="toggle pseudo button" v-text="label.title"></span>
      </label>
    </header>

    <div class="tab-view-contents">
      <div class="tab-view-contents-inner" v-bind:style="contentContainerStyle">
        <div class="tab-view-content" v-for="(label, index) in labels" :key="`content-${index}-${label.id}`"
          v-bind:style="contentElementStyle">
          <slot v-bind:name="label.id">Content of {{label.title}}.</slot>
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
  overflow: hidden;
}

.tab-view-content {
  float: left;
}

.tab-view-contents-inner {
  transition: margin-left ease 0.5s;
}
</style>
