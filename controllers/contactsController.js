const Users = require("../models/users");

const contactsController = {
    // Step 2: Create an Endpoint for Email Verification
  async getUsersByToken(req, res) {
    try {
      const singleUser = await Users.findOneAndUpdate(
        // If the user is found - set verificationToken to null, and set the verify field to true in the user document and return Successful response
        { token: req.params.token },
        { $set: { verificationToken: null, verify: "true" } },
        { new: true }
      );

      // If user with such token is not found, return Error 'Not Found'
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "Verification successful", data: singleUser });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
      return err;
    }
  },
};

module.exports = contactsController;
