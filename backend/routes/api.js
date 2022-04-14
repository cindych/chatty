const express = require('express')

const Message = require('../models/message')
const Room = require('../models/room')

const router = express.Router()

router.get('/rooms', async (req, res, next) => {
  try {
    const rooms = await Room.find()
    res.json(rooms)
  } catch (e) {
    next(new Error('error in retrieving rooms'))
  }
})

router.post('/rooms/create', async (req, res, next) => {
  const { name } = req.body
  try {
    await Room.create({ name, creator: req.session.username })
    res.status(201).send('room was successfully created')
  } catch (e) {
    next(new Error('error in creating room'))
  }
})

router.get('/messages', async (req, res, next) => {
  try {
    const messages = await Message.find()
    res.json(messages)
  } catch (e) {
    next(new Error('error in retrieving messages'))
  }
})

router.post('/messages/post', async (req, res, next) => {
  const { content, room } = req.body
  const sender = req.session.username
  try {
    await Message.create({ content, sender, room })
    res.status(200).send('message was posted')
  } catch (e) {
    next(new Error('error in posting message'))
  }
})

module.exports = router
