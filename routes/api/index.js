const express = require('express');
const router = express.Router();
const { getUsers, signup, login, logout } = require('../../controllers/index');
const auth = require('../../utils/auth');

router.route('/').get(auth, getUsers);
router.route('/users/login').post(login);
router.route('/users/signup').post(signup);
router.route('/users/logout').post(logout);


// .post();
// router.route('/:id').get().put().delete()

module.exports = router;
