const mongoose = require('mongoose')
const Address = mongoose.model('Address')

const getActiveDevice = async (devices) => {
  let activeDevice
  let currentFloor
  let highScore = 0
  const t = new Date()
  t.setSeconds(t.getSeconds() - 30)
  for (let device of devices) {
    if (device.macAddress && device.updatedAt > t) {
      const { score: activeScore, latestFloor } = await Address.getActiveScoreByMacAddress(device.macAddress)
      console.log(`${device.name}'s ${device.device} has activeScore = ${activeScore} at ${latestFloor} flr.`, device.updatedAt)
      if(activeScore > highScore) {
        highScore = activeScore
        activeDevice = device
        currentFloor = latestFloor
      }
    }
  }
  return activeDevice
}


module.exports = {
  getActiveDevice
}
