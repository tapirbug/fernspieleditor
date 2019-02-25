<script>
/**
 * Menu bar.
 */
export default {
  name: 'bar',
  data () {
    return {}
  },
  computed: {
  },
  methods: {
  }
}
</script>

<template>
  <nav class="bar">
    <a href="#" class="brand">
      <span>fernspieleditor</span>
    </a>
    <div class="menu">
      <a href="#" class="pseudo button">Help</a>
      <a href="#" class="pseudo button">Open</a>
      <a href="#" class="button">Publish</a>
    </div>
  </nav>
</template>

<style lang="scss">
@import "../style/layout";

.bar {
  height: $header-height;
}
</style>
