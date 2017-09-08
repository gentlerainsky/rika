const mongoose = require('mongoose')
const Address = mongoose.model('Address')
const ORDINAL_NUMBER = {
  '1': 'st',
  '2': 'nd',
  '3': 'rd',
  '4': 'th'
}


const getAddressText = async (name, devices) => {
  let activeDevice
  let currentFloor
  let highScore = 0
  for (let device of devices) {
    if (device.macAddress) {
      const { score: activeScore, latestFloor } = await Address.getActiveScoreByMacAddress(device.macAddress)
      console.log(`${name}'s ${device.device} has activeScore = ${activeScore} at ${latestFloor}${ORDINAL_NUMBER[latestFloor]} flr.`)
      if(activeScore > highScore) {
        highScore = activeScore
        activeDevice = device
        currentFloor = latestFloor
      }
    }
  }
  if (activeDevice) {
    return `${name} is on ${currentFloor}${ORDINAL_NUMBER[currentFloor]} floor with ${activeDevice.device}.`
  }
  if (devices.length > 0) {
    const t = new Date()
    t.setSeconds(t.getSeconds() - 30)
    for (let device of devices) {
      if (device.updatedAt > t) return `${name} is probably not with device.`
    }
    return `${name} is not here.`
  }
  return `${name} is not jittstor.`
}


module.exports = {
  getAddressText
}
