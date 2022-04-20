const mongoose = require('mongoose')

const { Schema, model } = mongoose

const msgSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  senderPic: { type: String },
  room: { type: String, required: true },
})

const Message = model('Message', msgSchema)

module.exports = Message
