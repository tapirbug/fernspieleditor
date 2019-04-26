<script>

/**
 * An area that can be hidden and expanded again.
 */
export default {
  name: 'expandable',
  props: ['open'],
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>

<template>
  <div class="expandable">
    <slot></slot>
  </div>
</template>

<style lang="scss">
</style>
