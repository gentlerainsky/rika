const sprintf = require('sprintf-js').sprintf
const sentence = require('./sentence')

const getRandomSentence = (sentences) => sentences[Math.floor(Math.random() * sentence.length)]

const here = (name, floor, device) => {
  const randSentence = getRandomSentence(sentence.here)
  return sprintf(randSentence, `@${name.toLowerCase()} ${sentence.emoticonMap[name.toLowerCase()]}`, floor, device.toLowerCase())
}

const notHere = (name) => {
  const randSentence = getRandomSentence(sentence.notHere)
  return sprintf(randSentence, `@${name.toLowerCase()}`)
}

const dontKnow = (name) => {
  const randSentence = getRandomSentence(sentence.dontKnow)
  return sprintf(randSentence, name)
}

const noOne = () => {
  const randSentence = getRandomSentence(sentence.noOne)
  return sprintf(randSentence)
}

const listPeople = (people) => {
  const numPeople = people.length
  const peopleString = `@${people.join(', @')}`
  const randSentence = getRandomSentence(sentence.listPeople)
  return sprintf(randSentence, peopleString, numPeople)
}

const listAbsent = (people) => {
  const numPeople = people.length
  const peopleString = `@${people.join(', @')}`
  const randSentence = getRandomSentence(sentence.listAbsent)
  return sprintf(randSentence, peopleString, numPeople)
}

module.exports = {
  here,
  notHere,
  dontKnow,
  noOne,
  listPeople,
  listAbsent
}
