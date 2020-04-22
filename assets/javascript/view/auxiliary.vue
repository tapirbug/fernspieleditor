<script>
import Inspector from './inspector.vue'
import SoundEditor from './sound-editor.vue'
import TabView from './tab-view.vue'

/**
 * Tab view for the auxiliary editors.
 */
export default {
  name: 'Auxiliary',
  components: {
    'inspector': Inspector,
    'sound-editor': SoundEditor,
    'tab-view': TabView
  },
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
  <section class="auxiliary">
    <tab-view :labels="[{id: 'inspector', title: 'Inspector'}, {id: 'sounds', title: 'Sounds'}]">
      <template v-slot:inspector>
        <inspector></inspector>
      </template>
      <template v-slot:sounds>
        <sound-editor></sound-editor>
      </template>
    </tab-view>
  </section>
</template>

<style lang="scss">
.auxiliary {
  padding-top: 0.25em;
}
</style>
