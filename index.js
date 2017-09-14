const express = require('express')
const app = express()
const { get, trim, toLower, capitalize } = require('lodash/fp')

const bodyParser = require('body-parser')
const { Address, User } = require('./model')
const { processCommand } = require('./cmd')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const trace = ctx => data => {
  console.log(ctx, data)
  return data
}

app.get('/', async (req, res) => {
  res.send('Poop!')
})
app.post('/api/slack', async (req, res) => {
  console.log(`${new Date()} - ${req.body.user_name} finds ${req.body.text}`)
  const cmd = req.body.text
  const text = await processCommand(cmd).catch(err => console.error(err))
  res.send(text)
})
app.post('/api/address', (req, res) => {
  req.body.map(doc => {
    // trace('MacAddress: ')(doc.mac_address)
    // trace('Floor: ')(doc.floor)
    saveAddress(doc)
    return findAndUpdateFloor({ macAddress: doc.mac_address, floor: doc.floor, updatedAt: new Date() })
  })
  res.send('poop')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function tell(name, floor) {
  const sanitizedName = capitalize(name)
  if (floor == null) {
    return `I don't know where ${sanitizedName} is, I think not in the office.`
  }
  return `${sanitizedName} at ${floor} floor`
}

async function findByName(name) {
  const data = await User.findOne({ name }).select('name floor')
  return {
    name: get('name')(data) || null,
    floor: get('floor')(data) || null
  }
}

async function saveAddress(doc) {
  return (new Address(doc)).save()
    // .then(trace('Address Input saved'))
}

async function findAndUpdateFloor({ macAddress, floor, updatedAt }) {
  const userId = await getUserId(macAddress)
  if (!userId) {
    trace(`${new Date()} - This mac address not in DB: `)(macAddress)
    return null
  }
  return update(userId, { floor, updatedAt })
    // .then(trace('Find and Update result: '))
}

async function getUserId(macAddress) {
  return User
    .findOne({ macAddress })
    .select('_id')
    //.then(trace('Result from get ID'))
    .then(get('_id'))
}

async function update(_id, data) {
  return User.update({ _id }, data)
    // .then(trace('Update result'))
}
