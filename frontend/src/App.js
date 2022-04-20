import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SocketContext, socket } from './components/Socket'
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'

const App = () => (
  <>
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </SocketContext.Provider>
  </>
)

export default App
