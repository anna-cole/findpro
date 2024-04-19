import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import UserList from './components/UserList';
import Navbar from './components/Navbar';
import Errors from './components/Errors';

function App() {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/users")
      .then(resp => resp.json())
      .then(data => setUsers(data))
  }, [])

  useEffect(() => {
    fetch("/check_session")
    .then(r => {
      if (r.ok) {
        r.json().then(user => login(user));
      }
    });
  }, []);

  const login = user => {
    setCurrentUser(user);
    setLoggedIn(true);
  }

  const logout = () => {
    setCurrentUser(null);
    setLoggedIn(false);
  }

  // const addUser = user => {
  //   setUsers([...users, user])
  // }
  
  return (
    <Router>
      <Navbar logout={logout} loggedIn={loggedIn} />
      <Errors errors={errors} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup login={login} setErrors={setErrors} />} />
        <Route path="/login" element={<Login login={login} setErrors={setErrors} />} />
        <Route path="/users" element={<UserList users={users} />} />
      </Routes>
    </Router>
  )
}

export default App