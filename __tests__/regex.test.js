const { regexFloor } = require('../constants')

test('Floor regex mathching', () => {
  expect('f4').toMatch(regexFloor)
})
