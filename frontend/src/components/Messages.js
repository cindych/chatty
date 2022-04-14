import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Messages = ({ currRoom }) => {
  const [msgs, setMsgs] = useState([])

  const getMessages = async () => {
    try {
      if (currRoom !== '') {
        const { data } = await axios.get('/api/messages')
        data.filter(msg => msg.room === currRoom)
        setMsgs(data)
      }
    } catch (err) {
      alert('Error in retrieving messages')
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  return (
    <>
      {
        msgs.map(msg => (
          <p>
            <b>{`${msg.sender}: `}</b>
            {msg.content}
          </p>
        ))
      }
    </>
  )
}

export default Messages
