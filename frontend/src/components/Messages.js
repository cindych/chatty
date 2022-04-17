import React, {
  useState, useContext, useEffect, useRef,
} from 'react'
import axios from 'axios'
import { SocketContext } from './Socket.js'

const Messages = ({ currRoom }) => {
  const [msgs, setMsgs] = useState([])
  const ref = useRef(currRoom)

  const socket = useContext(SocketContext)

  const getMessages = async () => {
    try {
      if (ref.current !== '') {
        const { data } = await axios.get('/api/messages')
        const filtered = data.filter(msg => msg.room === ref.current)
        setMsgs(filtered)
      }
    } catch (err) {
      alert('Error in retrieving messages')
    }
  }

  useEffect(() => {
    getMessages()

    socket.on('new msg', () => {
      getMessages()
    })

    socket.on('left room', () => {
      getMessages()
    })
  }, [])

  useEffect(() => {
    ref.current = currRoom
    getMessages()
  }, [currRoom])

  return (
    <>
      {
        msgs.map(msg => (
          <div className="d-flex pt-2">
            <svg className="my-auto" height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
            </svg>
            <p className="ms-1 p-0 m-0" key={msg._id}>
              <b>{`${msg.sender}: `}</b>
              {msg.content}
            </p>
          </div>
        ))
      }
    </>
  )
}

export default Messages
