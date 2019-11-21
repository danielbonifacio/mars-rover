import React from 'react'
import './RoversList.scss'

const RoversList = ({ rovers, removeRover, executeAll }) => (
  <>
    {
      rovers.length
        ? <div className="RoversList">
          {
            rovers.map(rover => <div key={rover.id} className="rover">
              <div className="RoverID">{rover.id}</div>
              <div className="RoverinitialCoordinate">{rover.getInitialCoordinate()}</div>
              <div className="RoverInstructions">{rover.instructions}</div>
              <div className="RoverDelete">
                <button
                  onClick={() => removeRover(rover.id)}
                >
                  {'Del.'}
                </button>
              </div>
            </div>)
          }
          <button
            onClick={executeAll}
          >
            {'Execute all'}
          </button>
        </div>
        : null
    }
  </>
)

export default RoversList
