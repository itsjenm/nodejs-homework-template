const contactsOperations = require("../../models/contacts");

const addContact = async (body) => {
    try {
        const data = await contactsOperations.addContact(body);
        return data; 
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};


module.exports = addContact; 