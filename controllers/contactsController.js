const Users = require("../models/users");
const nanoid = require('nanoid');

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
        .json({ message: "Verification successful", user: singleUser });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
      return err;
    }
  },
  // Step 3: adding an email to the user with a verification link
  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
      // // firebase auth = no need for JWT
      // const newUser = await createUserWithEmailAndPassword(
      //   auth,
      //   email,
      //   password
      // );
      // const user = newUser.user;
      // sendEmailVerification(user)
      // res.json(user.stsTokenManager);
      // check if the user exist
      const userExist = await Users.findOne({ email: email });
      if (userExist) {
        return res.status(409).json({
          status: "error",
          code: 409,
          message: "Email is already in use",
          data: "Conflict",
        });
      }
      const hashed = await bcrypt.hash(password, 10);
      //   create a token and store in db
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });
      // create a verification token using nanoid
      const verifyToken = await nanoid();
      console.log(verifyToken);

      // generate a profile url based on email using gravatar
      const avatarURL = "https:" + gravatar.url(email);
      //   create the user to target table and columns they are supposed to be in.
      //   .create adds to the db
      const newUser = await Users.create({
        email: email,
        // REMEMBER: You don't want to send the hashed password in the response, even if its hashed
        password: hashed,
        //data that verifies if they are in the application in this current session
        token: token,
        avatarURL: avatarURL,
        // create a verification toke for the user and write it to the database (to generate a token)
        verificationToken: verifyToken,
      });

      // until the session times out, then the session resets
      // check if the user is authenticated using req.session
      // clears out data in the session if inactivity
      req.session.userToken = token;
      // console.log(req.session);

      res.status(201).json({
        status: "success",
        code: 201,
        data: {
          message: "Registration successful",
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = contactsController;
