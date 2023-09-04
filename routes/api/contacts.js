const express = require("express");
const router = express.Router();
const { getUsersByToken } = require("../../controllers/contactsController");

//Create a GET /users/verify/:verificationToken, endpoint, where we will search for a user in the User model by the verificationToken parameter.
router.route("/users/verify/:verificationToken").get(getUsersByToken);

module.exports = router;
