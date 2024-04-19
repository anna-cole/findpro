import React from 'react'

const Errors = ({ errors }) => {
  const displayErrors = <p>{errors}</p>
  return (
    <>
      { errors ? displayErrors : null }
    </>
  )
}

export default Errors