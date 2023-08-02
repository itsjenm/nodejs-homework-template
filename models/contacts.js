const fs = require('fs/promises');
const path = require('path');
const { v4 } = require("uuid");

const filePath = path.join(__dirname, 'contacts.json');

const getAllContacts = async () => {
  const data = await fs.readFile(filePath);
  const contacts = JSON.parse(data);
  return contacts;
}



// const listContacts = async () => {}

// const getContactById = async (contactId) => {}

// const removeContact = async (contactId) => {}

const addContact = async (body) => {
  // Get the existing contacts by calling the 'getAllContacts' function.
  const contacts = await getAllContacts(); 
  // Create a new contact object by spreading the 'body' object and adding a unique 'id' property using 'v4' from the 'uuid' module.
  const newContact = {...body, id: v4() };
  // Add the new contact to the 'contacts' array.
  contacts.push(newContact);
   // Write the updated contacts array back to the 'contacts.json' file using 'fs.writeFile'.
   await fs.writeFile(filePath, JSON.stringify(contacts));
   // Return the newly added contact object to the caller.
   return newContact; 
}

// const updateContact = async (contactId, body) => {}

module.exports = {
  getAllContacts,
  // listContacts,
  // getContactById,
  // removeContact,
  addContact,
  // updateContact,
}
