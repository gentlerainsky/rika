const mongoose = require('mongoose')
const { DATABASE_URI } = require('../config')
const Address = require('./address')

mongoose.Promise = global.Promise
mongoose.connect(DATABASE_URI)

module.exports = {
  Address,
}
