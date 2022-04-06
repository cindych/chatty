const mongoose = require('mongoose')

const { Schema, model } = mongoose

const roomSchema = new Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true },
})

const Room = model('Room', roomSchema)

module.exports = Room
