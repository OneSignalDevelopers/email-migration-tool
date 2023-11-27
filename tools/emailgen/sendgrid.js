import { faker } from '@faker-js/faker'
import fs from 'fs'

const contacts = []
for (let i = 0; i < 1999; i++) {
  contacts.push(createRandomEmail())
}

const csv = convertJsonToCsv(contacts)
saveContactsToFile(csv, 'contact-list.csv')

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
  let csv =
    'email,first_name,last_name,address_line_1,address_line_2,city,state_province_region,postal_code,country\n'
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i] // assuming faker is used to generate names
    csv += `${contact.email},${contact.first_name},${contact.last_name},,,,,,\n`
  }
  return csv
}
