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
  try {
    await Room.create({ name: req.body.name, creator: req.session.username })
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
  try {
    if (req.body.senderPic && req.body.senderPic !== '') {
      await Message.create({
        content: req.body.content, sender: req.session.username, room: req.body.room, senderPic: req.body.senderPic,
      })
    } else {
      await Message.create({ content: req.body.content, sender: req.session.username, room: req.body.room })
    }
    res.status(200).send('message was posted')
  } catch (e) {
    next(new Error('error in posting message'))
  }
})

module.exports = router
