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

  const updateMessages = () => {
    getMessages()
  }

  useEffect(() => {
    getMessages()

    socket.on('new msg', () => {
      updateMessages()
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
          <p key={msg._id}>
            <b>{`${msg.sender}: `}</b>
            {msg.content}
          </p>
        ))
      }
    </>
  )
}

export default Messages
