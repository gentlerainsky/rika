const sprintf = require('sprintf-js').sprintf
const sentence = require('./sentence')

const here = (name, floor, device) => {
  const randSentence = sentence.here[Math.floor(Math.random() * sentence.here.length)];
  return sprintf(randSentence, `@${name.toLowerCase()} ${sentence.emoticonMap[name.toLowerCase()]}`, floor, device.toLowerCase())
}

const notHere = (name) => {
  const randSentence = sentence.notHere[Math.floor(Math.random() * sentence.notHere.length)];
  return sprintf(randSentence, `@${name}`)
}

const dontKnow = (name) => {
  const randSentence = sentence.dontKnow[Math.floor(Math.random() * sentence.dontKnow.length)];
  return sprintf(randSentence, `@${name}`)
}

const noOne = () => {
  const randSentence = sentence.noOne[Math.floor(Math.random() * sentence.noOne.length)];
  return sprintf(randSentence)
}

const listPeople = (people) => {
  const peopleString = `@${people.join(', @')}`
  const randSentence = sentence.listPeople[Math.floor(Math.random() * sentence.listPeople.length)];
  return sprintf(randSentence, peopleString)
}

module.exports = {
  here,
  notHere,
  dontKnow,
  noOne,
  listPeople
}
