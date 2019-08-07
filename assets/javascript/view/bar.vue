<script>
import { mapGetters, mapActions } from 'vuex'
import { saveAs } from 'file-saver'
import { TO_YAML, LOAD_FILE } from '../store/action-types.js'

/**
 * Menu bar.
 */
export default {
  name: 'Bar',
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['canSave', 'saveBlockers'])
  },
  methods: {
    ...mapActions({
      toYaml: TO_YAML,
      loadFile: LOAD_FILE
    }),
    serialize () {
      if (!this.canSave) {
        this.failSerialize(this.saveBlockers)
        return
      }

      this.toYaml().then(
        phonebookYaml => saveAs(
          new File(
            [phonebookYaml],
            'phonebook.yaml',
            {
              type: 'application/x-yaml' // No official MIME type :(
            }
          )
        ),
        console.error
      )
    },
    failSerialize (blockers) {
      alert(`Cannot save because: ${blockers.join(', ')}.`)
    },
    startLoadFile (evt) {
      const { files } = evt.target
      this.loadFile({ files })
        .then(
          undefined,
          err => {
            console.error(err)
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
        :disabled="!canSave"
        @click="serialize"
      >
        <img
          class="icon"
          src="../../images/file-download.svg"
          alt="Download"
          title="Download a copy of the current phonebook"
        >
        Download
      </a>
    </div>
  </nav>
</template>

<style lang="scss">
@import "../../style/variables";

.bar {
  height: $header-height;
}

.menu-open-file-input {
  display: none;
}
</style>
