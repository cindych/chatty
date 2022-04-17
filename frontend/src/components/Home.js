import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Plus } from 'react-bootstrap-icons'

import { SocketContext } from './Socket'
import Messages from './Messages'
import Popup from './Popup'

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState('')
  const [modalShow, setModalShow] = useState(false)
  const [msgInput, setMsgInput] = useState('')
  const [currRoom, setCurrRoom] = useState('')
  const [rooms, setRooms] = useState([])
  const [alert, setAlert] = useState([])

  const socket = useContext(SocketContext)
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

  const getRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms')
      setRooms(data)
    } catch (err) {
      alert('Error in retrieving rooms')
    }
  }

  const changeRoom = newRoom => {
    if (currRoom !== newRoom) {
      socket.emit('join room', currRoom, newRoom)
      setAlert([])
      setCurrRoom(newRoom)
    }
  }

  const postMessage = async () => {
    try {
      await axios.post('/api/messages/post', { content: msgInput, room: currRoom })
      setMsgInput('')
      socket.emit('new msg', currRoom)
    } catch (err) {
      alert('Error in posting message')
    }
  }

  useEffect(() => {
    checkUserLoggedIn()
    getRooms()

    socket.on('new room', () => {
      getRooms()
    })

    socket.on('a user joined this room', joinedUser => {
      setAlert(prevAlert => [...prevAlert, `${joinedUser} has joined the room`])
    })

    socket.on('a user left this room', exitedUser => {
      setAlert(prevAlert => [...prevAlert, `${exitedUser} has left the room`])
    })
  }, [])

  // emit to server so server can store user info in socket
  useEffect(() => {
    if (user !== '') {
      socket.emit('set username', user)
    }
  }, [user])

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
        <div className="header d-flex justify-content-between align-items-center pt-3 pb-2">
          <Button
            className="d-flex justify-content-center align-items-center ms-2"
            variant="light"
            size="sm"
            onClick={() => setModalShow(true)}
          >
            <Plus className="me-1" />
            Create Room
          </Button>
          <div className="d-flex">
            <p className="p-0 m-0 pe-3">{`user ${user}`}</p>
            <Button className="me-3" variant="light" size="sm" onClick={handleLogout}>LOGOUT</Button>
          </div>
        </div>
        <Card className="mx-auto d-flex flex-row shadow-md rounded mt-3" style={{ width: '90%', height: '80vh', minHeight: '720px' }}>
          <div className="rooms-container text-center" style={{ width: '20%' }}>
            <div className="rooms-list" style={{ overflow: 'auto', padding: '5%' }}>
              {rooms.map(room => <Button className="mt-2 p-1 rounded-0" key={room._id} style={{ width: '100%' }} variant="primary" onClick={() => changeRoom(room.name)}>{room.name}</Button>)}
            </div>
          </div>
          {currRoom !== '' ? (
            <>
              <div className="chat" style={{ width: '60%' }}>
                <h3 className="text-center pt-2 mb-0">{currRoom}</h3>
                <div className="messages-list px-2" style={{ height: '70%', overflow: 'auto' }}>
                  <Messages currRoom={currRoom} />
                </div>
                <div className="message-input p-2">
                  <Form.Control as="textarea" rows={3} value={msgInput} onChange={e => setMsgInput(e.target.value)} />
                  <div className="text-end mt-2"><Button style={{ width: '100%' }} onClick={postMessage} disabled={msgInput === ''}>Send</Button></div>
                </div>
              </div>
              <div className="alerts-container pe-2 pb-2" style={{ width: '20%' }}>
                <div style={{ height: '60%' }} />
                <div style={{ height: '40%' }}>
                  <h6 className="pt-1 ps-2 mb-0 pb-0">Notifications</h6>
                  <div className="p-1" style={{ overflow: 'auto', height: '80%' }}>
                    {alert.map(msg => (
                      <li className="mb-0" key={uuidv4()}><span style={{ marginLeft: '-10px' }}>{msg}</span></li>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="chat d-flex align-items-center justify-content-center" style={{ width: '80%' }}>
              <h1 style={{ maxWidth: '500px' }}>Join one of the rooms or create a room to start chatting!</h1>
            </div>
          )}
        </Card>

        <Popup
          show={modalShow}
          onHide={() => setModalShow(false)}
          getRooms={getRooms}
        />
      </div>
    )
  }

  return (
    <div className="homepage">
      {renderLoadingScreen()}
    </div>
  )
}

export default Home
