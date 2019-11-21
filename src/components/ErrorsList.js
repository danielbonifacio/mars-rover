import React from 'react'
import './ErrorsList.scss'

const ErrorsList = ({ errors }) => (
  <>
    {
      errors.length
        ? <div className="ErrorsList">
          {
            errors.map(error => <div key={error.message} className="error">{error.message}</div>)
          }
        </div>
        : null
    }
  </>
)

export default ErrorsList
