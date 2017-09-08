const sprintf = require('sprintf-js').sprintf
const sentence = require('./sentence')

const here = (name, floor, device) => {
  const randSentence = sentence.here[Math.floor(Math.random() * sentence.here.length)];
  return sprintf(randSentence, name, floor, device)
}

const notHere = (name) => {
  const randSentence = sentence.notHere[Math.floor(Math.random() * sentence.notHere.length)];
  return sprintf(randSentence, name)
}

const dontKnow = (name) => {
  const randSentence = sentence.notKnow[Math.floor(Math.random() * sentence.notKnow.length)];
  return sprintf(randSentence, name)
}

const noOne = () => {
  const randSentence = sentence.noOne[Math.floor(Math.random() * sentence.noOne.length)];
  return sprintf(randSentence)
}

const listPeople = (people) => {
  const randSentence = sentence.listPeople[Math.floor(Math.random() * sentence.listPeople.length)];
  return sprintf(randSentence, people)
}

module.exports = {
  here,
  notHere,
  dontKnow,
  noOne,
  listPeople
}
