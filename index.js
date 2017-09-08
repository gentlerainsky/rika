const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const { Address } = require('./model')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', function (req, res) {
  res.send('Hello World!')
})
app.post('/api', (req, res) => {
  (new Address({name: 'hello'})).save().then(str => console.log('hello', str))
  console.log(req.body)
  res.send('poop')
})
app.post('/api/address', (req, res) => {
  console.log(req.body)
  req.body.map(doc => {
    (new Address(doc)).save().then(str => console.log('After saved: ', str))
  })
  res.send('poop')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
