const { contacts: service } = require("../../services");

const removeContact = async (req, res, next) => {
    const contact = await service.removeContact(req.params.id);
    if (contact) {
        res.status(201).json({
            status: 'success',
            code: 201,
            message: 'User was deleted',
            data: {
                result: contact,
            }
        });
    } else {
        res.status(404).json({
            status: 'failed',
            code: 404, 
            message: 'Not found',
        })
    }
};

module.exports = removeContact;