const { contacts: service } = require("../../services");

// gets one contact
const getContactById = async (req, res, next) => {
    const singleContact = await service.getContactById(req.params.id);
    if (singleContact.length > 0) {
        res.json({
            status: 'success',
            code: 200,
            data: {
                result: singleContact,
            }
        });
    } else {
        res.json({
            status: 'failed',
            code: 404,
        });
    }
   
};

module.exports = getContactById;