import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import ProsList from './components/ProsList';
import Navbar from './components/Navbar';
import Errors from './components/Errors';
import Pro from './components/Pro';
import ProForm from './components/ProForm';

function App() {
  const [errors, setErrors] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pros, setPros] = useState([]);

  useEffect(() => {
    fetch("/check_session")
    .then(r => {
      if (r.ok) {
        r.json().then(user => login(user))
      }
    })
  }, [])

  useEffect(() => {
    fetch("/pros")
      .then(resp => resp.json())
      .then(pros => setPros(pros))
  }, [])

  const login = user => {
    setCurrentUser(user)
    setLoggedIn(true)
  }

  const logout = () => {
    setCurrentUser(null)
    setLoggedIn(false)
  }

  const addPro = newPro => {
    setPros([...pros, newPro])
  }

  const updatePro = updatedProObj => {
    const updatedPros = pros.map(pro => {
      if (pro.id === updatedProObj.id) {
        return updatedProObj
      } else {
        return pro
      }
    })
    setPros(updatedPros)
  }

  const deletePro = id => {
    const updatedPros = pros.filter(pro => pro.id !== id)
    setPros(updatedPros)
  }
  
  return (
    <Router>
      <Navbar logout={logout} loggedIn={loggedIn} />
      <Errors errors={errors} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup login={login} setErrors={setErrors} />} />
        <Route path="/login" element={<Login login={login} setErrors={setErrors} />} />
        <Route path="/pros" element={<ProsList pros={pros} currentUser={currentUser} deletePro={deletePro} updatePro={updatePro} />} />
        <Route path="/pros/:id" element={<Pro />} />
        <Route path="/newpro" element={<ProForm addPro={addPro} setErrors={setErrors} />} />
      </Routes>
    </Router>
  )
}

export default App