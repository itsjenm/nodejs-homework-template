const contactsOperations = require("../../models/contacts");

const updateContact = async (id, body) => {
    try {
        const data = await contactsOperations.updateContact(id, body);
        return data;
    } catch (error) {
        console.log(error.message);
        throw error.message;
    }
}


module.exports = updateContact;