import React from 'react'
import {
  Routes, Route, Outlet, Link,
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
