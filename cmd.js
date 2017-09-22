const {
  get,
  trim,
  toLower,
  pipe,
  replace,
  capitalize,
  difference,
  groupBy
} = require('lodash/fp')

const { Address, User } = require('./model')
const { getActiveDevice } = require('./getLocation')
const sentence = require('./content/sentence')
const rika = require('./content/rika')
const { regexFloor } = require('./constants')

const ORDINAL_NUMBER = {
  '1': 'st',
  '2': 'nd',
  '3': 'rd',
  '4': 'th'
}

const sanitizeInput = pipe(
  trim,
  toLower,
  replace('@', '')
)

module.exports = Command = {
  getAbsentTimestamp: function () {
    const t = new Date()
    t.setSeconds(t.getSeconds() - 30)
    return t
  },

  processCommand: async function (text) {
    const cmd = sanitizeInput(text)

    switch (cmd) {
      case 'office': return Command.getOfficePeople()
      case 'absent':  return Command.getAbsentPeople()
      case 'map': return Command.getOfficeMap()
      default:
        const result = regexFloor.exec(cmd)
        if (result) {
          const floor = Number(result[2])
          if (floor) return Command.getPeopleByFloor(floor)
        }
        return Command.getUserLocation(cmd)
    }
  },
  getPeopleByFloor: async function (floor) {
    const timeout = Command.getAbsentTimestamp()
    const users = await User.find({
      updatedAt: { $gte: timeout },
      device: { $ne: 'Device' },
    }).select('name').lean()
    let names = []
    let foundNames = users.map(user => (user.name))
    foundNames = [...new Set(foundNames)]
    for (let userName of foundNames) {
      const activeDevice = await Command.getUserActiveDevice(userName).catch(e => console.error(e))
      if (activeDevice.floor === floor) {
        names.push(capitalize(activeDevice.name))
      } else {
        console.log(activeDevice.device, `${activeDevice.floor}floor. is not on request floor.`)
      }
    }
    console.log(names)
    const floorText = `${floor}${ORDINAL_NUMBER[floor]}`
    return rika.listFloor([...new Set(names)], floorText)
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
  getUserActiveDevice: async function (name) {
    const userDevices = await User.find({ name }).lean()
    return await getActiveDevice(userDevices)
  },
  getUserLocation: async function (_name) {
    const devices = await User.find({ name: _name })
    const activeDevice = await getActiveDevice(devices)
    const name = capitalize(_name)
    if (activeDevice) {
      const currentFloor = activeDevice.floor
      return rika.here(name, `${currentFloor}${ORDINAL_NUMBER[currentFloor]}`, activeDevice.device)
    }
    if (devices.length > 0) {
      const timeout = Command.getAbsentTimestamp()
      for (let device of devices) {
        if (device.updatedAt > timeout) return `${name} is probably not with his/her device.`
      }
      return rika.notHere(name)
    }
    return rika.dontKnow(name)
  },
  getUserFloor: async function (_name) {
    const devices = await User.find({ name: _name })
    const activeDevice = await getActiveDevice(devices)
    const name = capitalize(_name)
    if (activeDevice) {
      const currentFloor = activeDevice.floor
      return currentFloor
    }
    return null
  },
  getOfficeMap: async function () {
    const names = await User.distinct('name', { device: { $ne: 'Device' } })
    const users = await Promise.all(
      names.map(async (name) => {
        const floor = await Command.getUserFloor(name)
        if (floor == null) {
          return { name, floor: 'absent' }
        }
        return { name, floor }
      })
    )

    const userByFloor = groupBy(user => user.floor, users)
    const attachments = Object.keys(userByFloor).sort().reverse()
      .map((floor) => {
        const floorUsers = userByFloor[floor]
        if (floor === 'absent') {
          return {
            title: `Absent`,
            text: floorUsers.map(user => sentence.emoticonMap[user.name]).join(' ')
          }
        }

        return {
          title: `${floor}${ORDINAL_NUMBER[String(floor)]} Floor`,
          text: floorUsers.map(user => sentence.emoticonMap[user.name]).join(' ')
        }
      })
    return { attachments }
  }
}
