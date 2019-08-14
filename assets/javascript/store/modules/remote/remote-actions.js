import {
  CONNECT,
  DISCONNECT,
  DEPLOY,
  SERIALIZE
} from '../../action-types.js'
import {
  ADD_CONNECTION,
  SELECT_CONNECTION,
  ENTER_REMOTE,
  RELEASE_SOCKET
} from '../../mutation-types.js'
import YAML from 'yaml'

const defaultPort = '38397'
const protocol = 'fernspielctl'

export default {
  [CONNECT] ({ commit, dispatch }, { host, name }) {
    return new Promise((resolve, reject) => {
      const uri = wsUriToHost(host)
      const socket = new window.WebSocket(uri, protocol)
      let determined = false
      socket.onopen = _evt => {
        const connection = { host, name, socket }
        commit(ADD_CONNECTION, connection)
        if (!determined) {
          determined = true
          resolve(connection)
        }
      }
      socket.onerror = () => {
        dispatch(DISCONNECT, host)
        if (!determined) {
          determined = true
          reject(new Error(`Could not connect to host "${host}".`))
        }
      }
      socket.onclose = () => {
        dispatch(DISCONNECT, host)
      }
      socket.onmessage = ({ data }) => {
        handleMessage({ commit }, host, data)
      }
    })
  },
  [DISCONNECT] ({ commit, getters }, host) {
    const connection = getters.findConnection(host)
    if (!connection) {
      // don't know that host, do nothing
      return
    }

    const socket = connection.socket
    if (!socket) {
      // socket already closed, do nothing
      return
    }

    const OPEN = 1
    if (socket.readyState === OPEN) {
      // shut down the connection
      socket.close()
    }

    commit(RELEASE_SOCKET, host)
  },
  /// Deploy the current phonebook to the given host and make
  /// this the active connection if it worked.
  /// Establishes a connection if not already connected, and uses
  /// the specified name to initialize it. If already connected,
  /// the given name is ignored.
  [DEPLOY] ({ getters, dispatch, commit }, { host, name }) {
    const phonebook = dispatch(SERIALIZE, null, { root: true })
    const connection = getters.isConnected(host)
      ? Promise.resolve(getters.findConnection(host))
      : dispatch(CONNECT, { host, name })

    Promise.all([phonebook, connection])
      .then(([phonebook, { socket }]) => {
        const command = YAML.stringify({
          invoke: 'run',
          with: phonebook
        })
        socket.send(command)
        // make this the active connection
        // the active state on the other side is
        // highlighted in the network view now.
        commit(SELECT_CONNECTION, host)
      })
  }
}

/**
 *
 * @param {String} host
 */
function wsUriToHost (host) {
  const portSeparator = host.indexOf(':')
  const hostWithoutPort = (portSeparator >= 1 && host.length >= portSeparator)
    ? host.substr(0, portSeparator)
    : host
  const port = (portSeparator >= 1 && (portSeparator + 2) < host.length)
    ? host.substr(portSeparator + 1)
    : defaultPort
  return `ws://${hostWithoutPort}:${port}`
}

function handleMessage ({ commit }, host, messageString) {
  const message = YAML.parse(messageString)

  if (message.type === 'transition') {
    const { to: { id } } = message
    if (typeof id === 'string') {
      commit(ENTER_REMOTE, { host, id })
    }
  } else if (message.type === 'start') {
    const { initial: { id } } = message
    if (typeof id === 'string') {
      commit(ENTER_REMOTE, { host, id })
    }
  }
}
