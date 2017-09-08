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
  tx: Number,
  rx: Number,
  uptime: Number,
  createdAt: { type: Date, default: Date.now },
})

Address.statics.getActiveScoreByMacAddress = async function getActiveScoreByMacAddress(macAddress) {
  const logs = await this.find({ mac_address: macAddress }).sort({ createdAt: -1 }).limit(20)
  let score = 0
  let prevLog
  let latestFloor
  if (logs.length > 0) latestFloor = logs[0].floor
  logs.forEach((log) => {
    if (prevLog) {
      if (log.floor != prevLog.floor) score += 320
      if (log.tx > 0) score += 10
      if (log.rx > 0) score += 10
      if (prevLog.tx != log.tx) {
        score += Math.abs(prevLog.tx - log.tx)/10000
      }
      if (prevLog.rx != log.rx) {
        score += Math.abs(prevLog.rx - log.rx)/10000
      }
    }
    prevLog = log
  })
  return  { score, latestFloor }
}

module.exports = mongoose.model('Address', Address)
