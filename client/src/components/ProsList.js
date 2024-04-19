import React from 'react'
import ProCard from './ProCard'

const ProsList = ({ pros }) => {
  const proCards = pros.map(pro => <ProCard key={pro.id} pro={pro} />)
  return (
    <div>
      <h1>Pro List</h1>
      <ul>
        {proCards}
      </ul>
    </div>
  )
}

export default ProsList