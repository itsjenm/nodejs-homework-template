const express = require('express');
const router = express.Router();
const { uploadFile } = require('../../controllers/contactsController');

router.route('/upload').post(uploadFile)


module.exports = router
