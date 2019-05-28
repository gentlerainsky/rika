const express = require('express')
const moment = require('moment')
const util = require('util')
const { exec } = require('child_process')
const bodyParser = require('body-parser')
const { get, trim, toLower } = require('lodash/fp')

const { PORT } = require('./config')
const { Address, User } = require('./model')
const { processCommand } = require('./cmd')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const execPromise = util.promisify(exec)

/** APIs */
app.get('/', async (req, res) => {
  const response = {
    message: 'Hello, this is Mr.Columbus. I can help you find your friends.'
  }
  response.datetime = moment()
  response.last_commit = await execPromise('git log -n 1', { encoding: 'UTF-8' })
  response.last_commit = response.last_commit.stdout
  res.status(200).json(response)
})

// Slack hook
app.post('/api/slack', async (req, res) => {
  console.log(`${new Date()} - ${req.body.user_name} finds ${req.body.text}`)
  const cmd = req.body.text
  const text = await processCommand(cmd).catch(err => console.error(err))
  res.send(text)
})

// Update mac address
app.post('/api/address', (req, res) => {
  req.body.map(doc => {
    saveAddress(doc)
    return findAndUpdateFloor({ macAddress: doc.mac_address, floor: doc.floor, updatedAt: new Date() })
  })
  res.send('poop')
})

app.listen(PORT, function () {
  console.log(`> Ready on http://localhost:${PORT}`)
})

/** Functions */
async function saveAddress(doc) {
  return (new Address(doc)).save()
}

async function findAndUpdateFloor({ macAddress, floor, updatedAt }) {
  const userId = await getUserIdByMacAddress(macAddress)
  if (!userId) {
    console.log(`${new Date()} - This mac address does not contains in DB: ${macAddress}`)
    return null
  }
  return updateUserById(userId, { floor, updatedAt })
}

async function getUserIdByMacAddress(macAddress) {
  return User
    .findOne({ macAddress })
    .select('_id')
    .then(get('_id'))
}

async function updateUserById(_id, data) {
  return User.update({ _id }, data)
}
