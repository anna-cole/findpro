import React from 'react'

const Errors = ({ errors }) => {
  const displayErrors = <p style={{color: "red"}}>{errors}</p>
  return (
    <>
      { errors ? displayErrors : null }
    </>
  )
}

export default Errors