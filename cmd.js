const { get, trim, toLower, capitalize, difference } = require('lodash/fp')
const { Address, User } = require('./model')
const { getAddressText } = require('./getLocation')
const rika = require('./content/rika')

module.exports = Command = {
  getAbsentTimestamp: function () {
    const t = new Date()
    t.setSeconds(t.getSeconds() - 30)
    return t
  },

  processCommand: async function (text) {
    const [cmd] = [text].map(trim).map(toLower)
    .map(str => str.replace('@', ''))
    switch (cmd) {
      case 'office': return Command.getOfficePeople()
      case 'absent':  return Command.getAbsentPeople()
      default: return Command.getUserLocation(cmd)
    }
  },

  getActiveNames: async function () {
    const timeout = Command.getAbsentTimestamp()
    const users = await User.find({
      updatedAt: { $gte: timeout },
      device: { $ne: 'Device' }
    }).select('name')
    const names = users.map(user => (capitalize(user.name)))
    return names
  },
  getInactiveNames: async function () {
    const timeout = Command.getAbsentTimestamp()
    const users = await User.find({
      updatedAt: { $lt: timeout },
      device: { $ne: 'Device' }
    }).select('name')
    const names = users.map(user => (capitalize(user.name)))
    return names
  },
  getOfficePeople: async function () {
    const names = await Command.getActiveNames()
    if (names.length === 0) {
      text = rika.noOne()
    } else {
      text = rika.listPeople([...new Set(names)])
    }
    return text
  },

  getAbsentPeople: async function () {
    const activeNames = await Command.getActiveNames()
    const inactiveNames = await Command.getInactiveNames()
    const names = difference(inactiveNames, activeNames)
    if (names.length === 0) {
      text = rika.noOne()
    } else {
      text = rika.listAbsent([...new Set(names)])
    }
    return text
  },

  getUserLocation: async function (name) {
    const userDevices = await User.find({ name })
    return await getAddressText(capitalize(name), userDevices)
  }
}
