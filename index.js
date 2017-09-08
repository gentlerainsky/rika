const express = require('express')
const app = express()
const { get, trim, toLower, capitalize } = require('lodash/fp')

const bodyParser = require('body-parser')
const { Address, User } = require('./model')
const { getAddressText } = require('./getLocation')

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
  const [sanitizedName] = [req.body.text]
    .map(trim)
    .map(toLower)
    .map(str => str.replace('@', ''))
  let text
  if (sanitizedName === 'office') {
    var t = new Date();
    t.setSeconds(t.getSeconds() - 30)
    const users = await User.find({
      updatedAt: { $gte: t },
      device: { $ne: 'Device' }
    }).select('name')

    const names = users.map(user => (capitalize(user.name)))
    if (names.length === 0) {
      text = 'No one at the office.'
    } else {
      text = [...new Set(names)].join(', ')
    }
    return res.send(text)
  }
  const users = await User.find({ name: sanitizedName })
  text = await getAddressText(capitalize(sanitizedName), users)
  res.send(text)
})
app.post('/api/address', (req, res) => {
  console.log(req.body)
  req.body.map(doc => {
    trace('MacAddress: ')(doc.mac_address)
    trace('Floor: ')(doc.floor)
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
    trace('This mac address not in DB: ')(macAddress)
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
