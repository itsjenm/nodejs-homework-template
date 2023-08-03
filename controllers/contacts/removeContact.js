const { contacts: service } = require("../../services");

const removeContact = async (req, res, next) => {
    const contact = await service.removeContact(req.params.id);
    res.status(201).json({
        status: 'success',
        code: 201,
        message: 'User was deleted',
        data: {
            result: contact,
        }
    });
};

module.exports = removeContact;