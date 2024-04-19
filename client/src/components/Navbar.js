import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ loggedIn, logout}) => {

  const navigate = useNavigate();

  const handleLogout = e => {
    e.preventDefault();
    fetch('/logout', {
      method: 'DELETE'
    })
    logout();
    navigate("/");
  }

  const displayedLinks = loggedIn ? 
  <ul>
    <li><Link to="/">Home</Link></li>
    <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
    <li><Link to="/users">Users</Link></li>
    <li>Games</li>
    <li>My Reviews</li>
  </ul> : 
  <ul>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/signup">Signup</Link></li>
    <li><Link to="/login">Login</Link></li>
  </ul>

  return (
    <>{displayedLinks}</>
  )
}

export default Navbar