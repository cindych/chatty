const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ['pomeranian'],
  maxAge: 24 * 60 * 60 * 1000, // cookie options: 24 hrs
}))

app.use(express.static('dist'))
app.use('/displayPics', express.static('displayPics'))

const accountRouter = require('./routes/account')
const apiRouter = require('./routes/api')

app.use(express.json())
app.use('/account', accountRouter)
app.use('/api', apiRouter)

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://cindych:676123@cluster0.rdvfo.mongodb.net/chatapp?retryWrites=true&w=majority'
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

io.on('connection', socket => {
  // store user info in socket
  socket.on('set username', user => {
    const altSocket = socket
    altSocket.data.user = user
  })

  // socket is disconnecting, relay to room
  socket.on('disconnecting', () => {
    const { rooms } = socket
    if (rooms.size > 1) { // socket was in another room besides its private room
      const iterator = rooms.values()
      iterator.next()
      const { value: exitedRoom } = iterator.next()
      io.to(exitedRoom).emit('a user left this room', socket.data.user)
    }
  })

  // socket joins a new room
  socket.on('join room', (origRoom, newRoom) => {
    if (origRoom && origRoom !== '') {
      socket.leave(origRoom)
      io.to(origRoom).emit('a user left this room', socket.data.user)
    }
    io.to(newRoom).emit('a user joined this room', socket.data.user)
    socket.join(newRoom)
  })

  // socket logs out
  socket.on('logout', currRoom => {
    if (currRoom && currRoom !== '') {
      socket.leave(currRoom)
      io.to(currRoom).emit('a user left this room', socket.data.user)
    }
  })

  // socket creates a new room
  socket.on('new room', () => {
    socket.broadcast.emit('new room')
  })

  // socket has sent a new msg
  socket.on('new msg', room => {
    io.to(room).emit('new msg')
  })

  // socket has updated display pic
  socket.on('display pic update', () => {
    io.emit('display pic update')
  })
})

// set favicon
app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

// set the initial entry point
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// error handling
app.use((err, req, res, next) => {
  res.status(500)
  res.send(`An error occurred! (${err})`)
})

// Start listening for requests
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
