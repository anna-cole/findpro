import React from 'react'
import UserCard from './UserCard'

const UserList = ({ users }) => {
  const userCards = users.map(user => <UserCard key={user.id} user={user} />)
  return (
    <div>
      <h1>User List</h1>
      <ul>
        {userCards}
      </ul>
    </div>
  )
}

export default UserList