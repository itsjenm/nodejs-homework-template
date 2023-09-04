const express = require('express');
const router = express.Router();
const { uploadFile, getUsers, login, signup, logout, updateFile, avatarUpload } = require('../../controllers/contactsController');

router.route('/').get(getUsers)
router.route('/users/login').post(login);
router.route('/users/signup').post(signup);
router.route('/users/logout').post(logout);
// avatarUpload is the middleware  from multer that handles a single file upload
router.route('/users/upload').post(avatarUpload, uploadFile);
router.route('/users/avatars').patch(avatarUpload, updateFile);


module.exports = router;
