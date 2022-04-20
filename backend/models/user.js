const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  picture: { type: String },
})

const User = model('User', userSchema)

module.exports = User
