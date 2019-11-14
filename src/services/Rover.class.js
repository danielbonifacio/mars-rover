const CARDINAL_DIRECTION = ['N', 'E', 'S', 'W']

const AXIS_MAP = {
  N: 'y',
  S: 'y',
  E: 'x',
  W: 'x'
}

const OPERATIONS_MAP = {
  N: 'sum',
  S: 'subtract',
  E: 'sum',
  W: 'subtract'
}

class Rover {
  /**
   * Initializes a new Rover
   * @param {String} initialCoordinate
   */
  constructor (initialCoordinate, limit) {
    const [x, y, direction] = initialCoordinate.split(' ')
    const [edgeX, edgeY] = limit.split(' ')

    this.x = parseInt(x)
    this.y = parseInt(y)
    this.direction = direction

    this.edgeX = parseInt(edgeX)
    this.edgeY = parseInt(edgeY)
  }

  /**
   * Verify if new axis value is accessible.
   * Will throw an error if isn't.
   *
   * @param {Number} value new axis value
   * @param {String} axis
   */
  checkIfAxisIsAccessible (value, axis) {
    const edge = this[`edge${axis.toUpperCase()}`]

    const isAccessible = value <= edge
    const isInEdge = edge === value

    if (!isAccessible) {
      throw Error('Sorry, I cant go there. It\'s not mapped.')
    }

    if (isInEdge) {
      console.log(`Ohh, I'm in the edge. This is my ${axis.toUpperCase()} axis limit.`)
    }
  }

  /**
   * Gets counter clockwise cardinal direction based
   * on actual direction state
   * @private
   */
  counterClockWise () {
    const index = CARDINAL_DIRECTION.indexOf(this.direction)
    const length = CARDINAL_DIRECTION.length

    const isInitialValue = index === 0
    const latestValue = CARDINAL_DIRECTION[length - 1]
    const previousValue = CARDINAL_DIRECTION[index - 1]

    return isInitialValue ? latestValue : previousValue
  }

  clockWise () {
    const index = CARDINAL_DIRECTION.indexOf(this.direction)
    const length = CARDINAL_DIRECTION.length

    const isLatestValue = index === length - 1
    const firstValue = CARDINAL_DIRECTION[0]
    const nextValue = CARDINAL_DIRECTION[index + 1]

    return isLatestValue ? firstValue : nextValue
  }

  turnLeft () {
    this.direction = this.counterClockWise()
  }

  turnRight () {
    this.direction = this.clockWise()
  }

  sumAxis (axis) {
    return this[axis] + 1
  }

  subtractAxis (axis) {
    return this[axis] - 1
  }

  moveForward () {
    const { direction } = this
    const axis = AXIS_MAP[direction]
    const operation = OPERATIONS_MAP[direction]

    const newAxisValue = this[`${operation}Axis`](axis)

    this.checkIfAxisIsAccessible(newAxisValue, axis)

    this[axis] = newAxisValue
  }
}

export default Rover
