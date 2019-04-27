<script>
import { mapGetters } from 'vuex'
import { saveAs } from 'file-saver'

/**
 * Menu bar.
 */
export default {
  name: 'bar',
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['phonebookYaml'])
  },
  methods: {
    serialize () {
      const yaml = new File(
        [this.phonebookYaml],
        'phonebook.yaml',
        {
          type: 'application/x-yaml' // No official MIME type :(
        }
      )

      saveAs(yaml)
    }
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
      <a href="#"
         class="button"
         v-on:click="serialize">
        <img class="icon" src="../images/file-download.svg" alt="Download" title="Download a copy of the current phonebook" />
        Download
      </a>
    </div>
  </nav>
</template>

<style lang="scss">
@import "../style/layout";

.bar {
  height: $header-height;
}
</style>
