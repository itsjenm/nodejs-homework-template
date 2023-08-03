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

const getContactById = async (id) => {
  const data = await fs.readFile(filePath);
  const contacts = JSON.parse(data);
  const singleContact = contacts.filter(item => item.id === id);
  return singleContact;
}

const removeContact = async (id) => {
  const data = await fs.readFile(filePath);
  const contacts = JSON.parse(data);
  const newData = contacts.filter(item => item.id !== id);
  await fs.writeFile(filePath, JSON.stringify(newData));
  return newData;
}

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

const updateContact = async (id, body) => {
  // create a new object for the updated contacted
  const { name, email, phone } = body;
  // reads the data 
  let data = await fs.readFile(filePath);
  // parses the data
  data = JSON.parse(data);
  // finds the contact to update
  const contactId = data.findIndex(item => item.id === id);
  // creates a new contact object by spreading the id, and adding the new info
  data[contactId] = {...data[contactId], name, email, phone }; 
  // writes the updated contact back to the contacts.json file 
  await fs.writeFile(filePath, JSON.stringify(data));
  // return the updated array of contacts
  return data; 
}

module.exports = {
  getAllContacts,
  // listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
