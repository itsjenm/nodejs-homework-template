const express = require('express');
const router = express.Router();
const { uploadFile, getUsers, login, signup, logout, updateFile } = require('../../controllers/contactsController');

router.route('/').get(getUsers)
router.route('/users/login').post(login);
router.route('/users/signup').post(signup);
router.route('/users/logout').post(logout);
router.route('/upload').post(uploadFile);
router.route('/users/avatars').patch(updateFile);


module.exports = router;
