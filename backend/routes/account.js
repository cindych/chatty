const express = require('express')

const User = require('../models/user')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.post('/signup', async ({ body }, res, next) => {
  const { username, password } = body
  try {
    await User.create({ username, password })
    res.send('user signup was successful')
  } catch (e) {
    next(new Error('error in user signup'))
  }
})

router.post('/login', async ({ body, session }, res, next) => {
  const { username, password } = body
  try {
    const user = await User.findOne({ username, password })
    if (user) {
      session.username = username
      res.send('user login successful')
    } else {
      res.send('user login unsuccessful')
    }
  } catch (e) {
    next(new Error('error in user login'))
  }
})

router.get('/isLoggedIn', async ({ body, session }, res) => {
  if (session.username) {
    res.send(session.username)
  } else {
    res.send(null)
  }
})

router.post('/logout', isAuthenticated, async (req, res) => {
  req.session.username = null
  res.send('user logout successful')
})

module.exports = router
