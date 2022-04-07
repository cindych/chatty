import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const loginUser = async () => {
    try {
      const { data } = await axios.post('/account/login', { username, password })
      if (data === 'user login successful') {
        navigate('/')
      } else {
        alert('There was an issue with logging in. Please try again!')
      }
    } catch (err) {
      alert('There was an issue with logging in. Please try again!')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card className="shadow rounded p-2" style={{ width: '50%', backgroundColor: '#FAE1DD' }} border="light">
        <Card.Body>
          <Card.Title className="text-center">LOGIN</Card.Title>
          <Form
            onSubmit={e => {
              e.preventDefault()
              loginUser()
            }}
          >
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control placeholder="Please enter a username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control placeholder="Please enter a password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <div className="text-center">
              <Button type="submit" className="mt-4" variant="light" disabled={username === '' || password === ''}>Login</Button>
            </div>
          </Form>
          <Card.Text className="mt-2 text-center">
            Don&apos;t have an account?&nbsp;
            <Link to="/signup">Sign up!</Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login
