const { regexFloor } = require('../constants')

test('Floor regex matching', () => {
  expect('f0').not.toMatch(regexFloor)
  expect('f10').not.toMatch(regexFloor)
  expect('floor1').not.toMatch(regexFloor)
  expect('f4').toMatch(regexFloor)
})
