const express = require('express');
// import controllers
const { contacts: ctrl } = require('../../controllers');
// import middleware 
const { ctrlWrapper } = require('../../middlewares');

const router = express.Router();

// @ GET /api/contacts

router.get('/', ctrlWrapper(ctrl.getAllContacts));

// @ POST /api/contacts

router.post('/', ctrlWrapper(ctrl.addContact)); 


// @ GET /api/contacts/:id

router.get('/:id', ctrlWrapper(ctrl.getContactById));


// @ DELETE /api/contacts/:id

router.delete('/:id', ctrlWrapper(ctrl.removeContact));

// @ PUT /api/contacts/:id

router.put('/:id', ctrlWrapper(ctrl.updateContact)); 

module.exports = router;
