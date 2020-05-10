import { mapGetters, mapMutations, mapActions } from 'vuex'
import {
  delta,
  distance
} from '../util/geom/points.js'
import { translate } from '../util/geom/transform.js'
import { intersectRayWithEllipse, connectEllipses } from '../util/geom/ellipses.js'
import { mapValues } from '../util/map-obj.js'
import { StatesGetters, statesGetterMappings } from '../store/modules/states/states-getters'
import { TransitionGetters } from '../store/modules/transitions/transitions-getters'
import { EditorGetters } from '../store/modules/editor/editor-getters'
import { StatesActions, statesActionMapping } from '../store/modules/states/states-actions'
import { Vec2D } from '../util/geom/vec2d.js'
import { StateSummaryWithRemoved } from '../store/modules/states/state.js'

interface NetworkViewData {
  palmId: string|null
  palmEl: HTMLElement|null
  firstGrabPosition: Vec2D|null
  lastGrabPosition: Vec2D|null
  stateSizes: StateSizes
}

interface NetworkViewComputed {
  readonly movedPos: Vec2D|undefined
}

interface NetworkViewMethods {
  updateStateSizes(): void
  stateSize (id: string): {width: number, height: number}|undefined
  select(id: string): void
  deselect(): void
  startGrab (id: string, position: Vec2D, el: HTMLElement): void
  continueGrab(position: Vec2D)
  movePalm (to: Vec2D)
  endGrab ()
  move(evt: MouseEvent)
  down (id: string, evt: MouseEvent)
  typed (evt: KeyboardEvent, id: string)
  insert(evt: Event)
  evtPosition(evt: MouseEvent): Vec2D
  stateStyle (stateId: StateSummaryWithRemoved): object
  stateClasses (stateId: StateSummaryWithRemoved): object
}

interface StateSizes {
  [stateId: string]: {width: number, height: number}
}

/**
 * Everything defined on the this element of the network view.
 */
interface NetworkView extends
  NetworkViewData,
  NetworkViewComputed,
  NetworkViewMethods,
  StatesActions,
  StatesGetters,
  TransitionGetters,
  EditorGetters {}

export function data (): NetworkViewData {
  return {
    palmId: null,
    palmEl: null,
    firstGrabPosition: null,
    lastGrabPosition: null,
    stateSizes: {}
  }
}

export const computed = {
  ...mapGetters([
    ...statesGetterMappings,
    'focusedState',
    'isFocused',
    'transitionSummariesFrom',
    'transitionSummariesTo',
    'isStateActiveOnRemote'
  ]),
  movedPos (this: NetworkView) {
    const palmState = this.findState(this.palmId)
    if (!this.firstGrabPosition || !this.palmId || palmState === null) {
      return undefined
    }

    const moveDistance = delta(this.firstGrabPosition, this.lastGrabPosition)

    const movedPos = translate(
      palmState.position,
      moveDistance
    )

    movedPos.x = Math.max(0, movedPos.x)
    movedPos.y = Math.max(0, movedPos.y)

    return movedPos
  },
  arrows
}

export const methods: NetworkViewMethods = {
  ...mapActions({
    ...statesActionMapping
  }),
  /**
   * State IDs mapped against their sizes in pixels.
   */
  updateStateSizes () {
    this.stateSizes = mapValues(
      this.$refs,
      child => {
        if (!child || child.length === 0) {
          return {
            width: 0,
            height: 0
          }
        } else {
          return {
            width: child[0].getBoundingClientRect().width || 0,
            height: child[0].getBoundingClientRect().height || 0
          }
        }
      },
      {}
    )
  },
  stateSize (id) {
    if (id in this.stateSizes) {
      return this.stateSizes[id]
    } else {
      // fallback size for the time until the first layout
      // is available
      return {
        width: 109,
        height: 109
      }
    }
  },
  select (id) {
    this.focusState(id)
  },
  deselect () {
    this.focusState(null)
  },
  startGrab (id, position, el) {
    this.palmId = id
    this.palmEl = el
    this.firstGrabPosition = position
    this.lastGrabPosition = position
  },
  continueGrab (nextGrabPosition) {
    if (!this.firstGrabPosition || !this.palmEl) {
      return
    }

    this.lastGrabPosition = nextGrabPosition

    // Only move visually, commit at the end of the grab
    this.movePalm(this.movedPos)
  },
  movePalm (to) {
    if (to) {
      this.palmEl.style.left = to.x + 'px'
      this.palmEl.style.top = to.y + 'px'
    }
  },
  endGrab (this: NetworkView) {
    const from = this.findState(this.palmId).position
    const to = this.movedPos

    const minimumMoveDistance = 3

    if (distance(from, to) > minimumMoveDistance) {
      // significant move, do it
      this.movePalm(to)
      this.updateState({ id: this.palmId, position: to })
    } else {
      // did scarcely move, undo it
      this.movePalm(from)
    }

    this.palmId = null
    this.palmEl = null
    this.firstGrabPosition = null
    this.lastGrabPosition = null
  },
  move (evt) {
    if (this.lastGrabPosition) {
      const released = evt.buttons === 0

      if (released) {
        this.endGrab()
      } else {
        const pos = this.evtPosition(evt)
        this.continueGrab(pos)
      }
    }
  },
  down (id, evt) {
    const target: HTMLElement = evt.target as HTMLElement
    const el = target.classList.contains('network-view-state')
      ? target
      : target.classList.contains('network-view-state-name') ? target.parentElement : false

    if (!el) {
      return
    }

    const pos = this.evtPosition(evt)
    this.startGrab(id, pos, el)
    this.select(id)
  },
  typed,
  insert,
  /** Position of a mouse event relative to this.$el */
  evtPosition (evt: MouseEvent) {
    return {
      x: evt.pageX - this.$el.offsetParent.offsetLeft,
      y: evt.pageY - this.$el.offsetParent.offsetTop
    }
  },
  stateStyle (this: NetworkView, state: StateSummaryWithRemoved): object {
    const position = state.position
    return {
      left: position.x,
      top: position.y,
      opacity: state.removed ? 0 : 1
    }
  },
  stateClasses (state: StateSummaryWithRemoved): object {
    return {
      'is-focused': this.isFocused(state.id),
      'is-any': this.isAny(state.id),
      'is-active-on-connected': this.isStateActiveOnRemote(state.id)
    }
  }
}

function arrows (this: NetworkView) {
  this.updateStateSizes()

  const transitionEdges = this.stateIds
    .map(this.transitionSummariesFrom)
    .reduce((a, b) => { a.push(...b); return a }, []) // flatten
    .sort(byFromAndThenTo)

  const arrows = transitionEdges.reduce(
    appendArrow,
    []
  )
    .map(
      arrow => {
        const fromPos = this.palmId === arrow.from ? this.movedPos : this.findState(arrow.from).position
        const toPos = arrow.isToSelf ? fromPos : (this.palmId === arrow.to ? this.movedPos : this.findState(arrow.to).position)
        const fromSize = this.stateSize(arrow.from)

        const positions = (() => {
          if (arrow.isToSelf) {
            return arrowThroughSingleEllipse(fromPos, fromSize)
          } else {
            const toSize = this.stateSize(arrow.to)
            const { from, to } = connectEllipses(
              { ...fromPos, ...fromSize },
              { ...toPos, ...toSize }
            )
            if (from === null || to === null) {
              throw new Error(`from = ${from}, to = ${to}`)
            }
            return { fromPos: from, toPos: to }
          }
        })()

        return {
          ...arrow,
          ...positions
        }
      },
      this
    )

  return arrows

  function byFromAndThenTo (a, b) {
    const valA = a.from + a.to
    const valB = b.from + b.to
    if (valA < valB) {
      return -1
    }
    if (valA > valB) {
      return 1
    }
    return 0
  }

  function appendArrow (arrows, nextTransition) {
    const lastArrow = (arrows.length === 0) ? false : arrows[arrows.length - 1]

    if (lastArrow && lastArrow.from === nextTransition.from && lastArrow.to === nextTransition.to) {
      lastArrow.label += ', ' + nextTransition.when
    } else {
      const isToSelf = nextTransition.from === nextTransition.to
      const hasInverse = isToSelf || transitionEdges.findIndex(
        transition => transition.from === nextTransition.to && transition.to === nextTransition.from
      ) !== -1

      arrows.push({
        fromName: nextTransition.fromName,
        toName: nextTransition.toName,
        from: nextTransition.from,
        to: nextTransition.to,
        label: nextTransition.when,
        isToSelf,
        hasInverse
      })
    }

    return arrows
  }

  function arrowThroughSingleEllipse (fromPos, fromSize) {
    const slope = 0.03
    const through = translate(fromPos, { x: 0, y: -fromSize.height * 0.25 })
    const left = intersectRayWithEllipse(
      through,
      {
        x: -1,
        y: -slope
      },
      {
        ...fromPos,
        ...fromSize
      }
    )

    const right = intersectRayWithEllipse(
      through,
      {
        x: 1,
        y: slope
      },
      {
        ...fromPos,
        ...fromSize
      }
    )

    return {
      fromPos: left,
      toPos: right
    }
  }
}

function typed (this: NetworkView, evt: Event, id: string) {
  const target: HTMLElement = evt.target as HTMLElement
  const oldVal = this.findState(id).name
  const newVal = target.innerText
  if (oldVal !== newVal) {
    this.continueUpdateState({
      id,
      name: newVal
    })
  }
}

function insert (this: NetworkView, evt: MouseEvent) {
  const target: HTMLElement = evt.target as HTMLElement
  if (!target.classList.contains('network-view')) {
    // Did not click on the background, but on something in the foregrond, stop.
    return
  }

  const insertionOffsetToPtr = {
    x: -40,
    y: -40
  }
  const position = this.evtPosition(evt)
  position.x += insertionOffsetToPtr.x
  position.y += insertionOffsetToPtr.y

  this.addState({
    name: 'New state',
    position
  })
}
