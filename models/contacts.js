const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'contacts.json');

const getAllContacts = async () => {
  const data = await fs.readFile(filePath);
  const contacts = JSON.parse(data);
  return contacts;
}



// const listContacts = async () => {}

// const getContactById = async (contactId) => {}

// const removeContact = async (contactId) => {}

// const addContact = async (body) => {}

// const updateContact = async (contactId, body) => {}

module.exports = {
  getAllContacts,
  // listContacts,
  // getContactById,
  // removeContact,
  // addContact,
  // updateContact,
}
