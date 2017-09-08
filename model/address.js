const mongoose = require('mongoose')
const { Schema } = mongoose

const Address = new Schema({
  name: String,
  ip: String,
  mac_address: String,
  ap_ip: String,
  floor: Number,
  signal: Number,
  speed: Number,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Address', Address)
