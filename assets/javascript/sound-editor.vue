<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { ADD_SOUND, UPDATE_SOUND } from './mutation-types.js'

/**
 * Menu bar.
 */
export default {
  name: 'SoundEditor',
  data () {
    return {
      newSoundName: '',
      /** Caches edit states distinct from the persistent sound state */
      editStates: {}
    }
  },
  computed: {
    ...mapState(['sounds'])
  },
  methods: {
    ...mapMutations({
      addSound: ADD_SOUND,
      updateSound: UPDATE_SOUND,
    }),
    // Object for storing editing state associated with a sound
    // that should not be part of the core model.
    editState (forSoundWithId) {
      if (typeof this.editStates[forSoundWithId] == 'undefined') {
        this.editStates[forSoundWithId] = {}
      }
      return this.editStates[forSoundWithId]
    },
    createSound () {
      if (this.newSoundName.length > 0) {
        this.addSound({ name: this.newSoundName })
      }
    }
  }
}
</script>

<template>
  <article class="auxiliary-editor sound-editor">
    <h2>Sounds</h2>

    <ul class="sound-editor-sounds">
      <li class="sound-editor-sound"
          v-for="sound in sounds"
          :key="`sound-editor-li-${sound.id}`"
      >
        <details class="sound-editor-sound-props">
          <summary class="sound-editor-sound-simple">
            <span class="expansion-button"></span>
            <h3 class="sound-editor-sound-name">
              <input type="text" v-bind:value="sound.name" @input="updateSound({ id: sound.id, name: $event.target.value })">
            </h3>
            <div class="sound-editor-sound-simple-input">
              <input type="range" min="0" max="1" step="0.05" @change="updateSound({id: sound.id, volume: $event.target.value })">
            </div>
            <div class="sound-editor-sound-simple-input">
              <label>
                <input type="checkbox" v-bind:checked="sound.loop" @change="updateSound({ id: sound.id, loop: $event.target.checked })">
                <span class="checkable">Loop</span>
              </label>
            </div>
          </summary>
          <div class="sound-editor-sound-props-details">
            <h4>Text-to-speech</h4>
            <textarea class="sound-editor-speech-input"
                      placeholder="Speech"
                      title="Text written here will be spoken out loud when entering a state with this sound applied."
                      v-bind:value="sound.speech"
                      @input="updateSound({ id: sound.id, speech: $event.target.value })"></textarea>
          </div>
        </details>
      </li>
    </ul>

    <article class="sound-editor-add">
      <h3 class="sound-editor-sound-name">
        <input type="text"
                placeholder="Name"
                v-model="newSoundName">
      </h3>
      <span class="sound-editor-add-actions">
        <button @click="createSound()"
                v-bind:disabled="newSoundName.length === 0">Add Sound</button>
      </span>
    </article>
  </article>
</template>

<style lang="scss">
$sound-title-font-size: 0.9em;

.sound-editor-sound-name {
  margin: 0;
  padding: 0;
  font-size: $sound-title-font-size;
  flex-basis: 15em;
}

.sound-editor-sounds {
  margin: 0;
  padding: 0;
}

.sound-editor-sound {
  list-style: none;
  border-bottom: 0.1em solid rgb(220, 220, 220);
}

.sound-editor-sound-simple {
  display: flex;
  align-items: center;
}

.sound-editor-sound-simple-input {
  padding: 0 0.2em;
}

.file-input {
  display: flex;

  > *:first-child {
    margin-right: 1em;
  }
}

.sound-editor-speech-input {
  height: 8em;
}

$expansion-button-height: 0.2em;
$expansion-button-width: 0.4em;
$expansion-button-color: black;
.expansion-button {
  flex-basis: 1em;
  position: relative;
  transition: transform ease 0.2s;

  &:after {
    content:"";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    bottom: -$expansion-button-height;
    width: 0;
    height: 0;
    border-top: $expansion-button-height solid transparent;
    border-bottom: $expansion-button-height solid transparent;
    border-left: $expansion-button-width solid $expansion-button-color;
  }

  details[open] & {
    transform: rotate(90deg);
  }
}

.sound-editor-add {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > *:first-child {
    padding-right: 1em;
  }
}

</style>
