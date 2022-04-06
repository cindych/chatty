const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const port = process.env.PORT || 3000
const app = express()
const cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ['pomeranian'],
  maxAge: 24 * 60 * 60 * 1000, // cookie options: 24 hrs
}))

app.use(express.static('dist'))

const accountRouter = require('./routes/account')

app.use(express.json())
app.use('/account', accountRouter)

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://cindych:676123@cluster0.rdvfo.mongodb.net/chatapp?retryWrites=true&w=majority'
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.get('/', (req, res) => {
  return res.send('hello world!')
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
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
