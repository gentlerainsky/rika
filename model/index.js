const mongoose = require('mongoose')
const { DATABASE_URI } = require('../config')
const Address = require('./address')
const User = require('./user')

mongoose.Promise = global.Promise
mongoose.connect(DATABASE_URI, { useNewUrlParser: true })

module.exports = {
  Address,
  User,
}
