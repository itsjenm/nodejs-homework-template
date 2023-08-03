const { contacts: service } = require("../../services");
const createError = require("http-errors");
const { contactSchema } = require("../../schemas");

const updateContact = async (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        throw createError(400, "Missing required field");
    }

    const result = await service.updateContact(req.params.id, req.body);
    if (req.params.id === -1) {
        res.status(404).json({
            message: 'Not found',
            code: 400,
        })
    } 
    res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            result,
        },
    });
};


module.exports = updateContact; 