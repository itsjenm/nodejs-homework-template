const express = require('express');
const router = express.Router();
const { getUsers, signup, login, logout, getCurrentUser } = require('../../controllers/index');
const authMiddleware = require('../../utils/authMiddleware');

router.route('/').get(authMiddleware, getUsers);
router.route('/users/login').post(login);
router.route('/users/signup').post(signup);
router.route('/users/logout').post(logout);
router.route('/users/current').get(authMiddleware, getCurrentUser);


// .post();
// router.route('/:id').get().put().delete()

module.exports = router;
