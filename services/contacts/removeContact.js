const contactsOperations = require("../../models/contacts");

const removeContact = async (id) => {
    try {
        const data = await contactsOperations.removeContact(id);
        return data;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};


module.exports = removeContact;