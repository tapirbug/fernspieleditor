<script>
import { mapGetters, mapActions } from 'vuex'
import { saveAs } from 'file-saver'
import { LOAD_FILE } from './action-types.js'

/**
 * Menu bar.
 */
export default {
  name: 'Bar',
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['phonebookYaml', 'phonebookYamlBlockers']),
    isBlocked () {
      return this.phonebookYamlBlockers.length > 0
    }
  },
  methods: {
    ...mapActions([LOAD_FILE]),
    serialize () {
      if (this.isBlocked) {
        this.failSerialize(this.phonebookYamlBlockers)
        return
      }

      const yaml = new File(
        [this.phonebookYaml],
        'phonebook.yaml',
        {
          type: 'application/x-yaml' // No official MIME type :(
        }
      )

      saveAs(yaml)
    },
    failSerialize (blockers) {
      alert(`Cannot save because: ${blockers.join(', ')}.`)
    },
    startLoadFile (evt) {
      const { files } = evt.target
      this[LOAD_FILE]({ files })
        .then(
          undefined,
          err => {
            alert(err)
          }
        )
    }
  }
}
</script>

<template>
  <nav class="bar">
    <a
      href="#"
      class="brand"
    >
      <span>fernspieleditor</span>
    </a>
    <div class="menu">
      <a
        href="#"
        class="pseudo button"
      >Help</a>
      <label class="pseudo button">
        Open
        <input
          class="menu-open-file-input"
          type="file"
          name="open-file"
          @input="startLoadFile"
        >
      </label>
      <a
        href="#"
        class="button"
        :disabled="isBlocked"
        @click="serialize"
      >
        <img
          class="icon"
          src="../images/file-download.svg"
          alt="Download"
          title="Download a copy of the current phonebook"
        >
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

.menu-open-file-input {
  display: none;
}
</style>
