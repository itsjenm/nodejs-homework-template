const { contacts: service } = require('../../services')

const getAllContacts = async (req, res, next) => {
    const contacts = await service.getAllContacts();
    res.json({
        status: 'success',
        code: 200,
        data: {
            results: contacts,
        },
    });
};

module.exports = getAllContacts;