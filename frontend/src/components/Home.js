import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState('')
  const navigate = useNavigate()

  const checkUserLoggedIn = async () => {
    try {
      const { data } = await axios.get('/account/isLoggedIn')
      if (data) {
        setIsLoggedIn(true)
        setUser(data)
      } else {
        setIsLoggedIn(false)
        setUser('')
      }
    } catch (err) {
      alert('Error in checking if user is logged in')
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/account/logout')
      checkUserLoggedIn()
    } catch (err) {
      alert('Error in logging out.')
    }
  }

  const renderLoadingScreen = () => {
    if (!isLoggedIn) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <CardGroup className="rounded shadow text-center" style={{ width: '50%' }}>
            <Card className="p-5" style={{ backgroundColor: '#FAE1DD' }} border="light">
              <Card.Body>
                <Card.Title>NO EXISTING ACCOUNT?</Card.Title>
                <Card.Text className="text-start mt-3">Signing up is quick &#38; simple, create an account today!</Card.Text>
                <Button variant="light" className="mt-2" onClick={() => navigate('/signup')}>SIGN UP</Button>
              </Card.Body>
            </Card>
            <Card className="p-5" style={{ backgroundColor: '#FAE1DD' }} border="light">
              <Card.Body>
                <Card.Title>HAVE AN ACCOUNT?</Card.Title>
                <Card.Text className="text-start mt-3">Log in and start chatting with other people now!</Card.Text>
                <Button variant="light" className="mt-2" onClick={() => navigate('/login')}>LOGIN</Button>
              </Card.Body>
            </Card>
          </CardGroup>
        </div>
      )
    }
    return (
      <div>
        <div className="d-flex justify-content-end align-items-center pt-3">
          <p className="p-0 m-0 pe-3">{`hello ${user}`}</p>
          <Button variant="light" className="me-3" size="sm" onClick={handleLogout}>LOGOUT</Button>
        </div>
        <Card className="mx-auto chat-container d-flex flex-row shadow-sm rounded" style={{ width: '90%', height: '80vh' }}>
          <div className="rooms-container text-center border-end" style={{ width: '30%' }}>
            <Button className="mt-3" variant="light">Create Room</Button>
            <div className="rooms-list">
              <Button className="mt-2 rounded-0" style={{ width: '100%' }} variant="primary">General</Button>
              <Button className="rounded-0" style={{ width: '100%' }} variant="primary">Food</Button>
              <Button className="rounded-0" style={{ width: '100%' }} variant="primary">Music</Button>
            </div>
          </div>
          <div className="chat" style={{ width: '70%' }}>
            <div className="messages-container" style={{ height: '90%' }}>
              <h5>Cindy</h5>
              <span>Hello</span>
            </div>
            <div className="message-input" style={{ height: '10%' }}>
              <Form.Control type="text" />
              <Button>Send</Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  useEffect(() => {
    checkUserLoggedIn()
  }, [])

  return (
    <div className="homepage">
      {renderLoadingScreen()}
    </div>
  )
}

export default Home
