import { faker } from '@faker-js/faker'
import fs from 'fs'

const contacts = []
for (let i = 0; i < 500; i++) {
  contacts.push(createRandomEmail())
}

const csv = convertJsonToCsv(contacts)
saveContactsToFile(csv, 'audience.csv')

function createRandomEmail() {
  return {
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
  }
}

function saveContactsToFile(contacts, filename) {
  fs.writeFileSync(filename, contacts)
}

function convertJsonToCsv(contacts) {
  let csv = 'Email Address,First Name,Last Name\n'
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i]
    csv += `${contact.email},${contact.first_name},${contact.last_name}\n`
  }
  return csv
}
