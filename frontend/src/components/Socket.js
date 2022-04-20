import React from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')
const SocketContext = React.createContext(socket)

export { SocketContext, socket }
