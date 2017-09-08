const mongoose = require('mongoose')
const { Schema } = mongoose

const User = new Schema({
  name: String,
  device: String,
  macAddress: String,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', User)
