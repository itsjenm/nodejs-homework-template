const contactsOperations = require('../../models/contacts');

const getAllContacts = async () => {
    try {
        const data = await contactsOperations.getAllContacts();
        return data;
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = getAllContacts;