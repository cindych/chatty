import React, { useState, useContext } from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { SocketContext } from './Socket'

const Popup = ({ show, onHide, getRooms }) => {
  const [roomInput, setRoomInput] = useState('')

  const socket = useContext(SocketContext)

  const createRoom = async () => {
    try {
      await axios.post('/api/rooms/create', { name: roomInput })
      socket.emit('new room')
      getRooms()
      setRoomInput('')
      onHide()
    } catch (err) {
      alert('Error in creating room')
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a room
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '5%' }}>
        <Form.Control placeholder="Type in a room name here" value={roomInput} onChange={e => setRoomInput(e.target.value)} />
        <div className="text-center mt-3">
          <Button onClick={createRoom} disabled={roomInput === ''}>Create</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default Popup
