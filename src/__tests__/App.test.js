import React from 'react'
import ReactDOM from 'react-dom'
import App, { baseRover } from '../App'

import { shallow } from 'enzyme'
import Rover from '../services/Rover.class'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

describe('Rover app', () => {
  it('should resetForm correctly', () => {
    const app = shallow(<App />)
    app.instance().resetForm()

    expect(app.state().form).toEqual({
      edges: '5 5',
      newRover: {
        roverId: '',
        initialCoordinate: '',
        instructions: ''
      }
    })
  })

  it('should clearErrors correctly', () => {
    const errors = [{
      message: 'foo',
      id: 'bar'
    }]

    const app = shallow(<App />)

    // INJECT ERROR MANUALLY
    app.instance().setState({ errors })
    expect(app.state().errors).toEqual([...errors])

    // clear error correctly
    app.instance().clearErrors()
    expect(app.state().errors).toEqual([])
  })

  it('should addRover correclty', () => {
    const rover = new Rover('Bumblebee', '1 2 N', '5 5')
    const app = shallow(<App />)

    const spy = jest.spyOn(app.instance(), 'clearErrors')

    // add rover correctly
    app.instance().addRover(rover)
    expect(app.state().rovers).toEqual([baseRover, rover])

    // should clear errors
    expect(spy).toHaveBeenCalled()
  })

  it('should removeRover correclty', () => {
    const rover = new Rover('test', '1 2 N', '5 5')
    const app = shallow(<App />)

    jest
      .spyOn(window, 'confirm')
      .mockImplementationOnce(() => true)

    // add rover correctly
    app.instance().addRover(rover)
    expect(app.state().rovers).toEqual([baseRover, rover])

    // remove added rover
    app.instance().removeRover('test')
    expect(app.state().rovers).toEqual([baseRover])

    // should not delete if user does not confirm
    jest
      .spyOn(global, 'confirm')
      .mockImplementationOnce(() => false)

    app.instance().addRover(rover)
    expect(app.state().rovers).toEqual([baseRover, rover])

    app.instance().removeRover('test')
    expect(app.state().rovers).toEqual([baseRover, rover])
  })

  it('should clearResponse correclty', () => {
    const app = shallow(<App />)

    app.instance().clearResponse()
    expect(app.state().roverResponse).toBe(null)
  })

  it('should handleAddNewRoverSubmit correclty', () => {
    const app = shallow(<App />)

    app.setState({
      form: {
        edges: '5 5',
        newRover: {
          roverId: 'Bumblebee',
          initialCoordinate: '1 2 N',
          instructions: 'LMLMLMLMM'
        }
      }
    })

    // methods that should be called by handleAddNewRoverSubmit
    const spies = [
      jest.spyOn(app.instance(), 'validateNewRoverForm'),
      jest.spyOn(app.instance(), 'addRover'),
      jest.spyOn(app.instance(), 'resetForm')
    ]

    app.instance().handleAddNewRoverSubmit()

    spies.forEach(spy => {
      expect(spy).toHaveBeenCalled()
    })

    // now it should catch a form error
    app.setState({
      form: {
        edges: '5 5',
        newRover: {
          roverId: '',
          initialCoordinate: '1 2 N',
          instructions: 'LMLMLMLMM'
        }
      }
    })

    expect(() => {
      app.instance().handleAddNewRoverSubmit()
    }).not.toThrow()

    // now it should catch a rover error
    app.setState({
      form: {
        edges: '5 5',
        newRover: {
          roverId: 'Bumblebee',
          initialCoordinate: 'A 2 N',
          instructions: 'LMLMLMLMM'
        }
      }
    })

    expect(() => {
      app.instance().handleAddNewRoverSubmit()
    }).not.toThrow()
  })

  it('should cover setters only methods', () => {
    const app = shallow(<App />)

    const data = [
      () => app.instance().setEdges({ target: { value: '' } }),
      () => app.instance().setRoverId({ target: { value: '' } }),
      () => app.instance().setinitialCoordinate({ target: { value: '' } }),
      () => app.instance().setInstructions({ target: { value: '' } })
    ]

    data.forEach(setter => {
      expect(() => {
        setter()
      }).not.toThrow()
    })
  })

  it('should executeAll correclty', () => {
    const rover = new Rover('Megatron', '3 3 E', '5 5')
    rover.setInstructions('MMRMMRMRRM')

    const app = shallow(<App />)

    const spy = jest.spyOn(app.instance(), 'clearResponse')

    app.instance().addRover(rover)
    app.update()
    app.instance().executeAll()

    expect(spy).toHaveBeenCalled()
    expect(app.state().roverResponse).toEqual('BumbleBee: 1 3 N\nMegatron: 5 1 E')

    // expect to catch error
    const rover2 = new Rover('Megatron', '5 5 N', '5 5')
    rover2.setInstructions('MMM')

    app.setState({
      rovers: [rover2]
    })

    expect(() => {
      app.instance().executeAll()
    }).not.toThrow()
  })
})
