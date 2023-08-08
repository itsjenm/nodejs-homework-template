// const fs = require('fs/promises')
// model allows you to create a collection based on the schema
const { Schema, model } = require("mongoose");
const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false, //defaults the favorite value to false
  },
}, { collection: 'contacts'});


const Contacts = model('Contacts', contactsSchema)


module.exports = Contacts;
