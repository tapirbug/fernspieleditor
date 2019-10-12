const alwaysKnownHosts = [
  {
    address: '127.0.0.1',
    name: 'This computer'
  }
].sort(sortByName)

export default {
  activeConnection: ({ activeConnection }) => activeConnection || null,
  activeSocket: ({ activeConnection, connections }) => connections[activeConnection] ? connections[activeConnection].socket : null,
  /// Checks whether the current phonebook has been deployed and a connection
  /// is open to the deployed fernspielapparat.
  hasConnection: ({ activeConnection, connections }) => activeConnection !== null && activeConnection in connections,
  isConnected: ({ connections }) => host => {
    return host in connections && connections[host].socket
  },
  findConnection: ({ connections }) => host => connections[host] || null,
  /// The ID of the state last known to be active on the last connected fernspielapparat.
  remoteActiveState: ({ activeConnection, activeStates }) => activeStates[activeConnection] || null,
  isStateActiveOnRemote: ({ activeConnection, activeStates }) => stateID => activeStates[activeConnection] === stateID,
  knownHosts: ({ connections }) => {
    const userDefinedAddresses = Object.keys(connections)
      .filter(connectedHost => !alwaysKnownHosts.some(({ address }) => connectedHost === address))
      .map(host => {
        const conn = connections[host]
        return {
          address: host,
          name: conn.name
        }
      })
      .sort(sortByName)
    return alwaysKnownHosts.concat(userDefinedAddresses)
  }
}

function sortByName ({ name: name1 }, { name: name2 }) {
  if (name1 < name2) {
    return -1
  } else if (name1 > name2) {
    return 1
  } else {
    return 0
  }
}
