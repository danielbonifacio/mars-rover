const CARDINAL_DIRECTION = ['N', 'E', 'S', 'W']

const AXIS_MAP = {
  N: 'y',
  S: 'y',
  E: 'x',
  W: 'x'
}

const OPERATIONS_MAP = {
  N: 'increment',
  S: 'decrement',
  E: 'increment',
  W: 'decrement'
}

const INSTRUCTIONS_MAP = {
  L: 'turnLeft',
  R: 'turnRight',
  M: 'moveForward'
}

class Rover {
  /**
   * Initializes a new Rover
   * @param {string} id
   * @param {string} initialCoordinate
   * @param {string} limit
   */
  constructor (id, initialCoordinate, limit) {
    this.validateInitialInputInfo(initialCoordinate, limit, id)

    const [x, y, direction] = initialCoordinate.split(' ')
    const [edgeX, edgeY] = limit.split(' ')

    this.id = id
    this.x = parseInt(x)
    this.y = parseInt(y)
    this.direction = direction

    this.edgeX = parseInt(edgeX)
    this.edgeY = parseInt(edgeY)

    this.instructions = ''
  }

  validateInitialInputInfo (initialCoordinate, limit, id) {
    const [x, y, direction] = initialCoordinate.split(' ')
    const [edgeX, edgeY] = limit.split(' ')

    const rules = [
      {
        condition: !CARDINAL_DIRECTION.includes(direction),
        message: `${direction} is not a valid cardinal direction`
      },
      {
        condition: !(id.length > 2),
        message: 'Rover Identificator length must be greater than 2'
      },
      {
        condition: !(id.length < 20),
        message: 'Rover Identificator length must be lesser than 20'
      },
      {
        condition: !x || !y || !direction,
        message: 'Badly formatted initial coordinates'
      },
      {
        condition: isNaN(x) || isNaN(y) || isNaN(edgeX) || isNaN(edgeY),
        message: 'Axis must be numbers'
      },
      {
        condition: parseInt(x) > parseInt(edgeX) || parseInt(y) > parseInt(edgeY),
        message: 'Initial coordinates could not be greater than edges'
      },
      {
        condition: parseInt(edgeX) <= 0 || parseInt(edgeY) <= 0,
        message: 'Edges needs to be greater than 0'
      }
    ]

    rules.forEach(({ condition, message }) => {
      if (condition) {
        throw new Error(message)
      }
    })
  }

  /**
   * Verify if new axis value is accessible.
   * Will throw an error if isn't.
   *
   * @param {number} value new axis value
   * @param {string} axis
   */
  checkIfAxisIsAccessible (value, axis) {
    const edge = this[`edge${axis.toUpperCase()}`]

    const isAccessible = value <= edge
    const isInEdge = edge === value

    if (!isAccessible || axis < 0) {
      throw new Error('Sorry, I cant go there. It\'s not mapped.')
    }

    if (isInEdge) {
      console.log(`Ohh, I'm in the edge. This is my ${axis.toUpperCase()} axis limit.`)
    }
  }

  /**
   * Validates if instructions are mapped
   * @param {string} instruction
   */
  validate (instruction) {
    if (instruction.length > 1) {
      instruction.split('').forEach(this.validate)
    } else {
      const isValid = Object.keys(INSTRUCTIONS_MAP).includes(instruction)

      if (!isValid) {
        throw new Error('Please, provide valid instructions: L, R or M (capitalized)')
      }
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

  incrementAxis (axis) {
    return this[axis] + 1
  }

  decrementAxis (axis) {
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

  /**
   * Executes single instruction
   * @param {string} instruction
   */
  execute (instruction) {
    this.validate(instruction)
    this[INSTRUCTIONS_MAP[instruction]]()
  }

  /**
   * Execute instructions sentence
   * @param {string} instructions
   */
  executeInstructionSentence (instructions) {
    instructions.split('').forEach(instruction => this.execute(instruction))
    return `${this.x} ${this.y} ${this.direction}`
  }

  /**
   * Set instructions
   * @param {string} instructions
   */
  setInstructions (instructions) {
    this.validate(instructions)
    this.instructions = instructions
  }

  /**
   * Execute internal state instructions
   */
  executeInstructions () {
    return this.executeInstructionSentence(this.instructions)
  }

  getInitialCoordinate () {
    return `${this.x} ${this.y} ${this.direction}`
  }
}

export default Rover
