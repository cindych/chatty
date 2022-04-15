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

const { adapter: mainAdapter } = io.of('/')

app.use(cookieSession({
  name: 'session',
  keys: ['pomeranian'],
  maxAge: 24 * 60 * 60 * 1000, // cookie options: 24 hrs
}))

app.use(express.static('dist'))

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
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('join room', (origRoom, newRoom) => {
    socket.leave(origRoom)
    if (origRoom && origRoom !== '') {
      socket.join(newRoom)
    }
    console.log(`socket ${socket.id} left room ${origRoom}`)
    console.log(`socket ${socket.id} joined room ${newRoom}`)
  })

  socket.on('new room', () => {
    socket.broadcast.emit('new room')
  })

  socket.on('new msg', room => {
    // const chat = io.sockets.in(room)
    // console.log(chat)
    io.to(room).emit('new msg')
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
  console.error(err.stack)
  res.status(500)
  res.send(`An error occurred! (${err})`)
})

// Start listening for requests
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
