
export default {
  transitions,
  transitionEdgesFrom,
  transitionSummariesFrom,
  transitionEdgesTo,
  transitionSummariesTo: (_transitions, getters, _rootState, rootGetters) => id =>
    nameFromAndTo(rootGetters)(getters.transitionEdgesTo(id))
}

function transitions (transitions, _getters, _rootState, rootGetters) {
  const activeTransitions = Object.entries(transitions)
    .filter(([sourceId]) => !rootGetters.isRemoved(sourceId))
    .map(([sourceId, transitions]) => {
      return [
        sourceId,
        Object.entries(transitions)
          .reduce(
            (acc, [type, options]) => {
              if (type === 'dial') {
                Object.entries(options)
                  .filter(([_, targetId]) => !rootGetters.isRemoved(targetId))
                  .forEach(([number, targetId]) => {
                    acc[type] = acc[type] || {}
                    acc[type][number] = targetId
                  })
              } else if (type === 'timeout') {
                const targetId = options.to
                if (!rootGetters.isRemoved(targetId)) {
                  acc[type] = options
                }
              } else {
                const targetId = options
                if (!rootGetters.isRemoved(targetId)) {
                  acc[type] = options
                }
              }
              return acc
            },
            {}
          )
      ]
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})

  return activeTransitions
}

function transitionSummariesFrom (_transitions, getters, _rootState, rootGetters) {
  /**
   * Gets an array of descriptions for all transition edges originating
   * from the given ID.
   *
   * The properties include those returned from `transitionEdgesFrom`:
   * * Unique transition type name: `type`,
   * * ID of originating state: `from`,
   * * ID of target state: `to`
   *
   * And some addition properties for humans:
   * * Human-readable description of the transition condition, `when` e.g.: `'Pick up'`, `'Dial 8'`,
   * * given name of originating state, may not be unique, `fromName`, e.g.: `'State 1'`, `'Any'`
   * * given name of target state, may not be unique, `toName`, e.g.: `'State 2'`.
   *
   * @param {string} id ID of originating state
   * @returns {array} transition edge descriptions
   */
  return function transitionSummariesFrom (id) {
    return nameFromAndTo(rootGetters)(getters.transitionEdgesFrom(id))
  }
}

function nameFromAndTo (rootGetters) {
  return function nameFromAndTo (edges) {
    return edges
      .map(desc => {
        const from = findState(desc.from)
        const to = findState(desc.to)
        return {
          ...desc,
          // Enrich with names obtained from root state
          fromName: from ? from.name : 'undefined',
          toName: to ? to.name : 'undefined'
        }
      })
  }

  function findState (id) {
    return rootGetters.findState(id)
  }
}

const describeTransition = {
  timeout: ({ to, after }) => [ {
    type: 'timeout',
    when: `Timeout (${after}s)`,
    to
  } ],
  dial: (transitions) => Object.keys(transitions)
    .sort()
    .map(num => {
      return {
        type: 'dial',
        num,
        when: `Dial ${num}`,
        to: transitions[num]
      }
    }),
  pick_up: (to) => {
    return [ {
      type: 'pick_up',
      when: 'Pick up',
      to
    } ]
  },
  hang_up: (to) => {
    return [ {
      type: 'hang_up',
      when: 'Hang up',
      to
    } ]
  },
  end: (to) => {
    return [ {
      type: 'end',
      when: 'Speech end',
      to
    } ]
  }
}

function transitionEdgesFrom (transitions, getters, _rootState, rootGetters) {
  /**
   * Gets array of objects, each describing one transition and its
   * transition condition.
   *
   * The objects have the following properties:
   * * Unique transition type name: `type`,
   * * ID of originating state: `from`,
   * * ID of target state: `to`,
   * * description of the transition condition: `when`, e.g. `'Type 5'`, `'Timeout (10s)'`.
   *
   * Transitions of the same type are next to each other in the
   * returned array, but their order with respect to each other
   * is undefined.
   *
   * @param {string} id ID of originating state
   * @returns {array} transition edge descriptions
   */
  return function transitionEdgesFrom (id) {
    return Object.keys(getters.transitions[id])
      .sort()
      // replace originating IDs with nested arrays, describing outgoing transitions
      .map(type => {
        if (!describeTransition[type] || !transitions[id][type]) {
          return []
        }
        return describeTransition[type](
          transitions[id][type]
        ).map(desc => {
          return {
            ...desc,
            from: id
          }
        })
      })
      // flatten out the nested arrays
      .reduce((a, b) => { a.push(...b); return a }, [])
  }
}

function transitionEdgesTo (transitions, getters, _rootState, rootGetters) {
  return function transitionEdgesTo (id) {
    return Object.keys(getters.transitions)
      .filter(idOrOther => idOrOther !== id)
      .map(id => getters.transitionEdgesFrom(id))
      .reduce((a, b) => { a.push(...b); return a }, [])
      .filter(edge => edge.to === id)
  }
}
