import {
  ADD_CONNECTION,
  SELECT_CONNECTION,
  ENTER_REMOTE,
  RELEASE_SOCKET
} from '../../mutation-types.js'
import Vue from 'vue'

export default {
  [SELECT_CONNECTION] (remote, host) {
    if (host in remote.connections) {
      remote.activeConnection = host
    }
  },
  [ADD_CONNECTION] (remote, { host, name, socket }) {
    if (host in remote.connections && remote.connections[host].socket) {
      // already had another connection, close the old one
      remote.connections[host].socket.close()
    }
    Vue.set(
      remote.connections,
      host,
      { socket, name }
    )
    remote.activeConnection = host // last connected is active
  },
  [RELEASE_SOCKET] (remote, host) {
    const connection = remote.connections[host]
    if (connection) {
      connection.socket = null
    }
  },
  /// Connected remote made a transition or re-started
  [ENTER_REMOTE] ({ activeStates }, { host, id: nowActive }) {
    Vue.set(activeStates, host, nowActive)
  }
}
