import React, {
  useState, useContext, useEffect, useRef,
} from 'react'
import axios from 'axios'

import { Person } from 'react-bootstrap-icons'
import { SocketContext } from './Socket'

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

    socket.on('display pic update', () => {
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
          <div className="d-flex align-items-center pt-3" key={msg._id}>
            { msg.senderPic
              ? <img src={msg.senderPic} alt="user display pic" width="25px" height="25px" style={{ objectFit: 'cover', borderRadius: '10%' }} />
              : <Person height="20px" width="20px" />}
            <p className="ms-1 p-0 m-0">
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
