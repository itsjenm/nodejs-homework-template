const express = require('express');
// import controllers
const { contacts: ctrl } = require('../../controllers');
// import middleware 
const { ctrlWrapper } = require('../../middlewares');

const router = express.Router();

// @ GET /api/contacts

router.get('/', ctrlWrapper(ctrl.getAllContacts));



// router.get('/', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// @ GET /api/contacts/:id

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

// @ POST /api/contacts

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

// @ DELETE /api/contacts/:id

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

// @ PUT /api/contacts/:id

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router;
