import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

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
          Think of a rad room name!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '5%' }}>
        <Form.Control placeholder="Type in a name here" value={roomInput} onChange={e => setRoomInput(e.target.value)} />
        <div className="text-center mt-3">
          <Button onClick={createRoom} disabled={roomInput === ''}>Create Room</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default Popup
