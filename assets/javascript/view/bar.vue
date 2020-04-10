<script>
import { mapGetters, mapActions } from 'vuex'
import { saveAs } from 'file-saver'
import { TO_YAML, LOAD_FILE, CONNECT, DEPLOY } from '../store/action-types.js'

/**
 * Menu bar.
 */
export default {
  name: 'Bar',
  data () {
    return {
      // this one is used by vue and updated to empty string when
      // add endpoint is selected
      endpointModel: '127.0.0.1',
      // this one is really selected
      endpoint: '127.0.0.1',
      // the endpoint currently being edited in the adding dialog
      newEndpoint: '',
      newEndpointFailureMessage: '',
      newEndpointConnecting: false,
      runFailureMessage: '',
      lastConnectAttemptEndpoint: '127.0.0.1'
    }
  },
  computed: {
    ...mapGetters(['canSave', 'saveBlockers', 'isConnected', 'knownHosts']),
    isSelectedEndpointConnected () {
      return this.isConnected(this.endpoint)
    }
  },
  methods: {
    ...mapActions({
      connect: CONNECT,
      deploy: DEPLOY
    }),
    // Run / deploy
    setEndpoint (newEndpoint) {
      this.endpoint = newEndpoint
      this.connect({ host: newEndpoint, name: newEndpoint })
    },
    addEndpoint (evt) {
      evt.preventDefault()
      evt.stopPropagation()
      // restore the last selection
      this.endpointModel = this.endpoint
      // and ensure the dialog has an initially empty text field
      this.newEndpoint = ''
      // and no error either
      this.newEndpointFailureMessage = ''
      // unlock the connect button
      this.newEndpointConnecting = false
      // and open the adding modal
      this.$refs.addEndpointModal.checked = true
    },
    handleConnect (evt, retryUrl) {
      // do not go to #
      evt.preventDefault()

      // clear previous errors
      this.newEndpointFailureMessage = ''
      this.newEndpointConnecting = true

      const endpoint = this.newEndpoint
      this.lastConnectAttemptEndpoint = endpoint

      this.connect({ host: endpoint, name: endpoint })
        .then(
          socket => {
            // select new endpoint
            this.endpointModel = endpoint
            this.endpoint = endpoint
            // and close add endpoint modal
            this.$refs.addEndpointModal.checked = false
            // also close error modal when retrying
            if (this.$refs.runEndpointErrorModal.checked) {
              this.$refs.runEndpointErrorModal.checked = false
              // and retry the run
              this.handleRun()
            }
          },
          error => {
            this.newEndpointFailureMessage = `${error}`
          }
        )
        .finally(() => {
          this.newEndpointConnecting = false
        })
    },
    handleRun () {
      const endpoint = this.endpoint
      if (endpoint) {
        this.lastConnectAttemptEndpoint = endpoint
        this.deploy({ host: this.endpoint, name: this.endpoint })
          .then(
            socket => console.log('deployed', socket),
            error => {
              this.$refs.runEndpointErrorModal.checked = true
              this.runFailureMessage = error.message
              // set retry address for retry button
              this.newEndpoint = endpoint
              console.error('deploy failed', error)
            }
          )
      }
    },
    // Save / open
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
        phonebookYaml =>
          saveAs(
            new File([phonebookYaml], 'phonebook.yaml', {
              type: 'application/x-yaml' // No official MIME type :(
            })
          ),
        console.error
      )
    },
    failSerialize (blockers) {
      alert(`Cannot save because: ${blockers.join(', ')}.`)
    },
    startLoadFile (evt) {
      const { files } = evt.target
      this.loadFile({ files }).then(undefined, err => {
        console.error(err)
        alert(err)
      })
    }
  }
}
</script>

<template>
  <article class="bar">
    <header class="brand-name">
      <a
        href="#"
      >
        <h1>fernspieleditor</h1>
      </a>
    </header>
    <div class="bar-actions">
      <select
        v-model="endpointModel"
        class="menu-endpoint"
        name="endpoint"
        @change="$event.target.value ? setEndpoint($event.target.value) : addEndpoint($event)"
      >
        <option
          v-for="host in knownHosts"
          :key="`connect-option-${host.address}`"
          :value="host.address"
          v-text="host.name"
        ></option>
        <option
          class="add"
          value
        >
          <!-- This one has empty vlaue so on-change will call addEndpoint when selected -->
          Add fernspielapparat...
        </option>
      </select>
      <a
        href="#"
        class="pseudo button menu-remote is-run"
        @click="handleRun"
      >
        <span class="menu-remote-run">Run</span>
      </a>
      <label class="pseudo button">
        Open
        <input
          class="menu-open-file-input"
          type="file"
          name="open-file"
          @input="startLoadFile"
        />
      </label>
      <a
        href="#"
        class="button"
        :style="!canSave"
        @click="serialize"
      >
        <img
          class="icon"
          src="../../images/file-download.svg"
          alt="Download"
          title="Download a copy of the current phonebook"
        />Download
      </a>
    </div>
    <div class="modal">
      <input
        id="bar-add-endpoint-model"
        ref="addEndpointModal"
        type="checkbox"
      />
      <label
        for="bar-add-endpoint-model"
        class="overlay"
      ></label>
      <article>
        <header>
          <h3>Connect fernspielapparat</h3>
          <label
            for="bar-add-endpoint-model"
            class="close"
          >&times;</label>
        </header>
        <section class="content">
          <label>
            Hostname:
            <input
              v-model="newEndpoint"
              type="text"
              placeholder="phantom.local:8080"
            >
          </label>
          <div
            v-if="newEndpointFailureMessage"
            class="bar-add-endpoint-error"
            v-text="newEndpointFailureMessage"
          ></div>
        </section>
        <footer>
          <button
            class="button"
            :disabled="newEndpointConnecting"
            @click="handleConnect"
          >
            <span v-if="newEndpointConnecting">Connecting...</span>
            <span v-if="!newEndpointConnecting">Connect</span>
          </button>
          <label
            for="bar-add-endpoint-model"
            class="button dangerous"
          >
            Cancel
          </label>
        </footer>
      </article>
    </div>
    <div class="modal">
      <input
        id="bar-run-error"
        ref="runEndpointErrorModal"
        type="checkbox"
      />
      <label
        for="bar-run-error"
        class="overlay"
      ></label>
      <article>
        <header>
          <h3>Run Error</h3>
          <label
            for="bar-run-error"
            class="close"
          >&times;</label>
        </header>
        <section class="content">
          Sorry, we could not run the phonebook on the selected fernspielapparat.
          There seems to be a problem with your connection.
          <div
            v-if="runFailureMessage"
            class="bar-add-endpoint-error"
            v-text="runFailureMessage"
          ></div>
        </section>
        <footer>
          <button
            class="button"
            :disabled="newEndpointConnecting"
            @click="handleConnect"
          >
            <span v-if="newEndpointConnecting">Connecting...</span>
            <span v-if="!newEndpointConnecting">Reconnect</span>
          </button>
          <label
            for="bar-run-error"
            class="button dangerous"
          >
            Cancel
          </label>
        </footer>
      </article>
    </div>
  </article>
</template>

<style lang="scss">
@use "../../style/variables/colors";
@use "../../style/variables/layers";
@use "../../style/variables/layout";

.bar {
  height: layout.$header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 .2em rgba(17,17,17,.2);
  padding: layout.$bar-padding;
  position: relative;
  z-index: layers.$bar;
}

.brand-name {
  flex-basis: 50%;
  flex-grow: 10;

  a {
    color: colors.$text-heading;
    font-weight: 700;
    font-size: 0.4em;
  }
}

.bar-actions {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .button {
    white-space: nowrap;
  }

  .icon {
    margin-right: 0.4em;
  }
}

.menu-open-file-input {
  display: none;
}

.menu-endpoint {
  flex-basis: 10em;
}

.menu-remote {
  &.is-run {
    /* override picnicss */
    background-color: colors.$run !important;
    color: colors.$text-button-inverse !important;
  }
}

.bar-add-endpoint-error {
  border-radius: 0.2em;
  border: 0.05em solid colors.$error;
  color: colors.$error;
  padding: 0.2em 0.8em;
  margin-top: 0.7em;
}
</style>
