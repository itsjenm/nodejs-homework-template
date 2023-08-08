const express = require('express')
const router = express.Router();
const { getContacts, createContact, getSingleContact, deleteContact, updateContact, updateFavorites } = require('../../controllers');

// router.get('/', async (req, res, next) => {
//   const data = await Contacts.find(); 
//   res.json(data)
// })

router.route('/').get(getContacts).post(createContact);
router.route('/:id').get(getSingleContact).put(updateContact).delete(deleteContact);
router.route('/:id/favorite').patch(updateFavorites);

// router.get('/:contactId', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// router.post('/', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// router.delete('/:contactId', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// router.put('/:contactId', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

module.exports = router
