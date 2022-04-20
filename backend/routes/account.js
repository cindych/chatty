const express = require('express')

const User = require('../models/user')
const Message = require('../models/message')
const isAuthenticated = require('../middlewares/isAuthenticated')
const upload = require('../middlewares/storage')

const router = express.Router()

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      await User.create({ username: req.body.username, password: req.body.password })
      res.send('user signup was successful')
    } else {
      res.send('user already exists')
    }
  } catch (e) {
    next(new Error('error in user signup'))
  }
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username, password })
    if (user) {
      req.session.username = username
      res.send('user login successful')
    } else {
      res.send('user login unsuccessful')
    }
  } catch (e) {
    next(new Error('error in user login'))
  }
})

router.get('/isLoggedIn', async (req, res) => {
  if (req.session.username) {
    const user = await User.findOne({ username: req.session.username })
    res.send(user)
  } else {
    res.send(null)
  }
})

router.post('/logout', isAuthenticated, async (req, res) => {
  req.session.username = null
  res.send('user logout successful')
})

router.post('/addDisplay', upload.single('imgFile'), async (req, res, next) => {
  try {
    await User.updateOne({ username: req.session.username }, { picture: req.file.path })
    await Message.updateMany({ sender: req.session.username }, { senderPic: req.file.path })
    res.send('display picture changed')
  } catch (e) {
    next(new Error('error in setting display picture'))
  }
})

module.exports = router
