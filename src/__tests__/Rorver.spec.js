import Rover from '../services/Rover.class'

describe('Rover class', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should create instance without crash', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')

    expect(rover.direction).toBe('N')
    expect(rover.y).toBe(2)
    expect(rover.x).toBe(1)
    expect(rover.edgeX).toBe(5)
    expect(rover.edgeY).toBe(5)
  })

  it('should correctly check if axis is Accessible', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')

    expect(() => {
      rover.checkIfAxisIsAccessible(4, 'x')
    }).not.toThrow()

    expect(() => {
      rover.checkIfAxisIsAccessible(6, 'x')
    }).toThrow()
  })

  it('should log on console if get on edge', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')
    const spy = jest.spyOn(console, 'log').mockImplementation()

    rover.checkIfAxisIsAccessible(5, 'x')
    expect(spy).toHaveBeenCalledWith('Ohh, I\'m in the edge. This is my X axis limit.')
  })

  it('should pick counter clockwise cardial direction correctly', () => {
    const roverFromNorth = new Rover('BumbleBee', '1 2 N', '5 5')
    const roverFromEast = new Rover('BumbleBee', '1 2 E', '5 5')
    const roverFromSouth = new Rover('BumbleBee', '1 2 S', '5 5')
    const roverFromWest = new Rover('BumbleBee', '1 2 W', '5 5')

    expect(roverFromNorth.counterClockWise()).toBe('W')
    expect(roverFromEast.counterClockWise()).toBe('N')
    expect(roverFromSouth.counterClockWise()).toBe('E')
    expect(roverFromWest.counterClockWise()).toBe('S')
  })

  it('should pick clockwise cardial direction correctly', () => {
    const roverFromNorth = new Rover('BumbleBee', '1 2 N', '5 5')
    const roverFromEast = new Rover('BumbleBee', '1 2 E', '5 5')
    const roverFromSouth = new Rover('BumbleBee', '1 2 S', '5 5')
    const roverFromWest = new Rover('BumbleBee', '1 2 W', '5 5')

    expect(roverFromNorth.clockWise()).toBe('E')
    expect(roverFromEast.clockWise()).toBe('S')
    expect(roverFromSouth.clockWise()).toBe('W')
    expect(roverFromWest.clockWise()).toBe('N')
  })

  it('should call counterClockwise method on turn left', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')
    const spy = jest.spyOn(rover, 'counterClockWise').mockImplementation()

    rover.turnLeft()
    expect(spy).toHaveBeenCalled()
  })

  it('should call clockWise method on turn right', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')
    const spy = jest.spyOn(rover, 'clockWise').mockImplementation()

    rover.turnRight()
    expect(spy).toHaveBeenCalled()
  })

  it('should increment and decrement axis correctly', () => {
    const rover = new Rover('BumbleBee', '2 2 N', '5 5')

    expect(rover.incrementAxis('x')).toBe(3)
    expect(rover.incrementAxis('y')).toBe(3)

    expect(rover.decrementAxis('x')).toBe(1)
    expect(rover.decrementAxis('y')).toBe(1)
  })

  it('should move forward correctly', () => {
    const data = [
      {
        initialCoordinates: '2 2 N',
        edges: '5 5',
        expected: {
          y: 3,
          x: 2
        }
      },
      {
        initialCoordinates: '1 4 N',
        edges: '5 5',
        expected: {
          y: 5,
          x: 1
        }
      },
      {
        initialCoordinates: '2 1 N',
        edges: '5 5',
        expected: {
          y: 2,
          x: 2
        }
      },
      {
        initialCoordinates: '2 3 S',
        edges: '5 5',
        expected: {
          y: 2,
          x: 2
        }
      },
      {
        initialCoordinates: '5 5 S',
        edges: '5 5',
        expected: {
          y: 4,
          x: 5
        }
      },
      {
        initialCoordinates: '2 3 E',
        edges: '5 5',
        expected: {
          y: 3,
          x: 3
        }
      },
      {
        initialCoordinates: '1 1 E',
        edges: '5 5',
        expected: {
          y: 1,
          x: 2
        }
      },
      {
        initialCoordinates: '5 5 W',
        edges: '5 5',
        expected: {
          y: 5,
          x: 4
        }
      },
      {
        initialCoordinates: '3 1 W',
        edges: '5 5',
        expected: {
          y: 1,
          x: 2
        }
      }
    ]

    data.forEach(({ initialCoordinates, edges, expected }) => {
      const rover = new Rover('BumbleBee', initialCoordinates, edges)
      const check = jest.spyOn(rover, 'checkIfAxisIsAccessible').mockImplementation()

      rover.moveForward()

      expect(rover.y).toEqual(expected.y)
      expect(rover.x).toEqual(expected.x)
      expect(check).toHaveBeenCalled()
    })
  })

  it('execute sigle instruction correctly', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')

    rover.execute('M')
    expect(rover.y).toBe(3)

    rover.execute('L')
    expect(rover.direction).toBe('W')

    rover.execute('R')
    expect(rover.direction).toBe('N')
  })

  it('should call execute method on instruction chain', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')
    const execute = jest.spyOn(rover, 'execute').mockImplementation()

    rover.executeInstructionSentence('LMLMLMLMM')
    expect(execute).toHaveBeenCalledTimes('LMLMLMLMM'.length)
  })

  it('should return correct values on instruction chain', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')

    expect(rover.executeInstructionSentence('LMLMLMLMM')).toBe('1 3 N')
  })

  it('should modify instructions correctly', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')

    rover.setInstructions('LMLMLMLMM')
    expect(rover.instructions).toBe('LMLMLMLMM')
  })

  it('should call executeInstructionSentence correclty on executeInstructions call', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')

    const spy = jest.spyOn(rover, 'executeInstructionSentence')

    rover.setInstructions('LMLMLMLMM')
    rover.executeInstructions()

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith('LMLMLMLMM')
  })

  it('should validate correctly on object initialization', () => {
    const wrongData = [
      {
        id: 'b',
        ic: '1 2 N',
        edges: '5 5'
      },
      {
        id: 'aaaaaaaaaaaaaaaaaaaaa',
        ic: '1 2 N',
        edges: '5 5'
      },
      {
        id: 'BumbleBee',
        ic: '1 2 C',
        edges: '5 5'
      },
      {
        id: 'BumbleBee',
        ic: '1 A N',
        edges: '5 5'
      },
      {
        id: 'BumbleBee',
        ic: 'A 2 N',
        edges: '5 5'
      },
      {
        id: 'BumbleBee',
        ic: '1 2 N',
        edges: 'A 5'
      },
      {
        id: 'BumbleBee',
        ic: '1 2 N',
        edges: '5 A'
      },
      {
        id: 'BumbleBee',
        ic: '6 1 N',
        edges: '5 5'
      },
      {
        id: 'BumbleBee',
        ic: '1 6 N',
        edges: '5 5'
      },
      {
        id: 'BumbleBee',
        ic: '0 0 N',
        edges: '0 1'
      },
      {
        id: 'BumbleBee',
        ic: '0 0 N',
        edges: '1 0'
      }
    ]

    wrongData.forEach(({ id, edges, ic }) => {
      expect(() => {
        new Rover(id, ic, edges)
      }).toThrow()
    })

    expect(() => {
      new Rover('BumbleBee', '1 2 N', '5 5')
    }).not.toThrow()
  })

  it('should validate instructions correctly', () => {
    const rover = new Rover('BumbleBee', '1 2 N', '5 5')

    const rightData = ['L', 'M', 'R', 'LMR']
    const wrongData = ['l', 'm', 'r', 'lmr', 'a', 'lMr', 'LmR', 1, '1']

    wrongData.forEach(instruction => {
      expect(() => {
        rover.validate(instruction)
      }).toThrow()
    })

    rightData.forEach(instruction => {
      expect(() => {
        rover.validate(instruction)
      }).not.toThrow()
    })
  })
})
