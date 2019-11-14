import React, { useState } from 'react'
import Rover from './services/Rover.class'
import AppLogo from './components/AppLogo'
import AppBackground from './components/AppBackground'

import './App.scss'

function App () {
  const [roverResponse, setRoverResponse] = useState('Waitig for instructions')
  const [edges, setEdges] = useState('5 5')
  const [initialCoordinates, setInitialCoordinates] = useState('1 2 N')
  const [instructions, setInstuctions] = useState('')

  const handleSubmit = (instructions) => {
    const rover = new Rover(initialCoordinates, edges)
    try {
      const roverResponse = rover.manualInput(instructions)
      setRoverResponse(roverResponse)
    } catch (e) {
      window.alert(e.message)
    }
  }

  return (
    <div className="App">
      <AppBackground />
      <AppLogo />
      <div className="content">
        <label>
          <span>{'Edges'}</span>
          <input
            placeholder={'Edges'}
            value={edges}
            onChange={e => setEdges(e.target.value)}
          />
        </label>
        <label>
          <span>{'Initial coordinates'}</span>
          <input
            placeholder={'Initial coordinates'}
            value={initialCoordinates}
            onChange={e => setInitialCoordinates(e.target.value)}
          />
        </label>
        <label>
          <span>{'Instructions'}</span>
          <input
            placeholder={'Instructions'}
            value={instructions}
            onChange={e => setInstuctions(e.target.value)}
          />
        </label>
        <div className="SubmitWrapper">
          <button
            onClick={() => handleSubmit(instructions)}
          >
            {'Execute'}
          </button>
        </div>
        <div className="Response">
          {roverResponse}
        </div>
      </div>
    </div>
  )
}

export default App
