const contactsOperations = require("../../models/contacts");

const getContactById = async (id) => {
    try {
        const data = await contactsOperations.getContactById(id);
        return data; 
    } catch (error) {
        console.log(error.message);
        throw error.message;
    }
};


module.exports = getContactById; 