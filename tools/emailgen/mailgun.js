import { faker } from '@faker-js/faker'
import fs from 'fs'

const contacts = []
for (let i = 0; i < 10000; i++) {
  contacts.push(createRandomEmail())
}

const csv = convertJsonToCsv(contacts)
saveContactsToFile(csv, 'mailgun.csv')

function createRandomEmail() {
  return {
    email: faker.internet.email(),
  }
}

function saveContactsToFile(contacts, filename) {
  fs.writeFileSync(filename, contacts)
}

function convertJsonToCsv(contacts) {
  let csv = ''
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i] // assuming faker is used to generate names
    csv += `${contact.email}\n`
  }
  return csv
}
