const { regexFloor } = require('../constants')

test('Floor regex matching', () => {
  expect('f0').not.toMatch(regexFloor)
  expect('f10').not.toMatch(regexFloor)
  expect('f1 here').not.toMatch(regexFloor)
  expect('floor1').toMatch(regexFloor)
  expect('f4').toMatch(regexFloor)
})
