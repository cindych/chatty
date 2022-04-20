import React from 'react'
import { useNavigate } from 'react-router-dom'

import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Button from 'react-bootstrap/Button'

const StartScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <CardGroup className="rounded shadow text-center" style={{ width: '50%', minWidth: '600px' }}>
        <Card className="p-5" style={{ backgroundColor: '#e1f0ec' }} border="light">
          <Card.Body>
            <Card.Title>NO EXISTING ACCOUNT?</Card.Title>
            <Card.Text className="text-start mt-3">Signing up is quick &#38; simple, create an account today! 🏃‍♀️</Card.Text>
            <Button variant="light" className="mt-2" onClick={() => navigate('/signup')}>SIGN UP</Button>
          </Card.Body>
        </Card>
        <Card className="p-5" style={{ backgroundColor: '#e1f0ec' }} border="light">
          <Card.Body>
            <Card.Title>HAVE AN ACCOUNT?</Card.Title>
            <Card.Text className="text-start mt-3">Log in and start chatting with other people now! 💬</Card.Text>
            <Button variant="light" className="mt-2" onClick={() => navigate('/login')}>LOGIN</Button>
          </Card.Body>
        </Card>
      </CardGroup>
    </div>
  )
}

export default StartScreen
