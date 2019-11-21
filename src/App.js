import React, { Component } from 'react'
import Rover from './services/Rover.class'
import AppLogo from './components/AppLogo'
import AppBackground from './components/AppBackground'
import ErrorsList from './components/ErrorsList'
import RoversList from './components/RoversList'

import './App.scss'
const BASE_EDGE = '5 5'
export const baseRover = new Rover('BumbleBee', '1 2 N', BASE_EDGE)
baseRover.setInstructions('LMLMLMLMM')

class App extends Component {
  componentDidMount () {
    this.generateRandomName({ preventDefault: () => null })
  }

  state = {
    errors: [],
    rovers: [baseRover],
    roverResponse: 'Waiting for instructions',
    form: {
      edges: BASE_EDGE,
      newRover: {
        roverId: '',
        initialCoordinate: '',
        instructions: ''
      }
    }
  }

  resetForm = () => {
    this.setState({
      form: {
        ...this.state.form,
        newRover: {
          roverId: '',
          initialCoordinate: '',
          instructions: ''
        }
      }
    })
  }

  clearErrors = () => {
    this.setState({
      errors: []
    })
  }

  addRover = (rover) => {
    this.clearErrors()
    this.setState({
      rovers: [...this.state.rovers, rover]
    })
  }

  removeRover = (id) => {
    const shouldRemove = confirm(`Are you sure you want to delete ${id} rover?`)
    if (shouldRemove) {
      this.setState({
        rovers: [...this.state.rovers.filter(r => r.id !== id)]
      })
    }
  }

  clearResponse = () => {
    this.setState({
      roverResponse: null
    })
  }

  handleAddNewRoverSubmit = () => {
    try {
      this.validateNewRoverForm()
      const { newRover, edges } = this.state.form
      const rover = new Rover(newRover.roverId, newRover.initialCoordinate, edges)
      rover.setInstructions(newRover.instructions)
      this.addRover(rover)
      this.resetForm()
    } catch (e) {
      if (e.message) {
        window.alert(e.message)
      }

      if (e.errors) {
        this.setState({
          errors: e.errors
        })
      }
    }
  }

  setEdges = (e) => {
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        edges: e.target.value
      }
    })
  }

  setRoverId = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        newRover: {
          ...this.state.form.newRover,
          roverId: e.target.value
        }
      }
    })
  }

  setinitialCoordinate = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        newRover: {
          ...this.state.form.newRover,
          initialCoordinate: e.target.value
        }
      }
    })
  }

  setInstructions = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        newRover: {
          ...this.state.form.newRover,
          instructions: e.target.value
        }
      }
    })
  }

  validateNewRoverForm () {
    const { form } = this.state

    const rules = [
      {
        condition: !form.edges.length,
        error: {
          id: 'edges',
          message: 'You must provide edges! E.g.: 5 5'
        }
      },
      {
        condition: form.edges.length !== 3 || typeof form.edges !== 'string',
        error: {
          id: 'edges',
          message: 'Badly formatted edges! E.g.: 5 5'
        }
      },
      {
        condition: !form.newRover.roverId,
        error: {
          id: 'roverId',
          message: 'You must provide an Rover identificator! E.g.: Bumblebee'
        }
      },
      {
        condition: !form.newRover.initialCoordinate,
        error: {
          id: 'initialCoordinate',
          message: 'You must provide initial coordinates for rover! E.g.: 1 2 N'
        }
      },
      {
        condition: !form.newRover.instructions,
        error: {
          id: 'initialCoordinate',
          message: 'You must provide initial instructions for rover! E.g.: LMLMLMLMM'
        }
      }
    ]

    const errors = rules
      .map(({ condition, error }) => condition ? error : null)
      .filter(err => err) // remove useless null objects from array

    if (errors.length) {
      throw { errors }
    }
  }

  executeAll = () => {
    try {
      this.clearResponse()
      const res = this.state.rovers.map(rover => `${rover.id}: ${rover.executeInstructions()}`)

      this.setState({
        roverResponse: res.join('\n')
      })
    } catch (err) {
      window.alert(err.message)
    }
  }

  generateRandomName = (e) => {
    e.preventDefault()
    fetch('https://randomuser.me/api/')
      .then(res => res.json())
      .then(data => {
        this.setState({
          form: {
            ...this.state.form,
            newRover: {
              ...this.state.form.newRover,
              roverId: data.results[0].name.first
            }
          }
        })
      })
  }

  render () {
    const { rovers, form, roverResponse, errors } = this.state
    return (
      <div className="App">
        <AppBackground />
        <AppLogo />
        <div className="content">
          <ErrorsList errors={errors} />
          <RoversList rovers={rovers} removeRover={this.removeRover} executeAll={this.executeAll} />

          <div className="TerrainSet">
            <span className="DisabledWarning">
              {'Disabled cause there are one or more rovers injected'}
            </span>
            <label>
              <span>{'Edges'}</span>
              <input
                placeholder={'Edges'}
                value={form.edges}
                onChange={this.setEdges}
                disabled={rovers.length}
              />
            </label>
          </div>

          <div className="NewRoverForm">
            <label>
              <span>{'Rover identificator'}
                <a
                  href="#"
                  onClick={this.generateRandomName}
                >
                  {'generate'}
                </a>
              </span>

              <input
                placeholder={'Rover identificator'}
                value={form.newRover.roverId}
                onChange={this.setRoverId}
              />
            </label>
            <label>
              <span>{'Initial coordinates'}</span>
              <input
                placeholder={'Initial coordinates'}
                value={form.newRover.initialCoordinate}
                onChange={this.setinitialCoordinate}
              />
            </label>
            <label>
              <span>{'Instructions'}</span>
              <input
                placeholder={'Instructions'}
                value={form.newRover.instructions}
                onChange={this.setInstructions}
              />
            </label>
            <div className="SubmitWrapper">
              <button
                onClick={this.handleAddNewRoverSubmit}
              >
                {'Add new Rover'}
              </button>
            </div>
          </div>

          <div className="Response">
            {roverResponse}
          </div>

          <button onClick={this.clearResponse}>
            {'Clear response'}
          </button>
        </div>
      </div>
    )
  }
}

export default App
