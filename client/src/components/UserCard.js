import React from 'react'

const UserCard = ({ user }) => {
  return (
    <li>id: {user.id} username: {user.username}</li>
  )
}

export default UserCard