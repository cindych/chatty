import React, { useState, useRef, useContext } from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'

import { SocketContext } from './Socket'

const Edit = ({ show, onHide, updatePic }) => {
  const [img, setImg] = useState('')
  const [showFailAlert, setShowFailAlert] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const imgFile = useRef()

  const socket = useContext(SocketContext)

  const onClickHandler = async () => {
    const formData = new FormData()
    formData.append('imgFile', imgFile.current)
    try {
      const { data } = await axios.post('/account/addDisplay', formData)
      if (data) {
        updatePic()
        socket.emit('display pic update')
        setShowFailAlert(false)
        setImg('')
        onHide()
      } else {
        setShowFailAlert(true)
      }
    } catch (err) {
      setShowFailAlert(true)
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
          Edit Display Picture
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '5%' }}>
        <Alert className="mb-2" show={showAlert} variant="danger">
          <p className="mb-0">Invalid format, please choose a file ending in .jpg, .jpeg, or .png!</p>
        </Alert>
        <Alert className="mb-2" show={showFailAlert} variant="danger">
          <p className="mb-0">Unable to set new display picture. Please try again!</p>
        </Alert>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload a picture</Form.Label>
          <Form.Control
            type="file"
            onChange={({ target }) => {
              const { files } = target
              const [image] = files
              if (image.name.match(/\.(jpg|jpeg|PNG|png)$/)) {
                setShowAlert(false)
                setImg(URL.createObjectURL(image))
                imgFile.current = image
              } else {
                setShowAlert(true)
              }
            }}
          />
        </Form.Group>
        {img !== '' && (<img className="mt-2" src={img} alt="product-pic" style={{ objectFit: 'cover' }} width="50px" height="50px" />)}
        <div className="text-center mt-3">
          <Button onClick={onClickHandler} disabled={img === ''}>Save</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default Edit
