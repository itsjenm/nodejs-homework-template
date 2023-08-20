const Users = require("../models/users");
// library for hashing
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usersController = {
  async getUsers(req, res) {
    try {
      const data = await Users.find();
      const hashed = await bcrypt.hash("abc123", 10); //salt = adding random letters at the end
      const token = await jwt.sign(
        { email: "abc@gmail.com" },
        process.env.JWT_SECRET,
        {
          //tokens can expire and are timed sensitive (this is the difference between bcrypt)
          expiresIn: "1h",
        }
      ); //jwt takes in a key after object
      //the token instance changes everytime it runs
      console.log(token);
      console.log("abc123", hashed);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  },
  async signup(req, res, next) {
    try {
      const { email, password } = req.body;
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
      //   create the user to target table and columns they are supposed to be in.
      //   .create adds to the db
      const newUser = await Users.create({
        email: email,
        // REMEMBER: You don't want to send the hashed password in the response, even if its hashed
        password: hashed,
        //data that verifies if they are in the application in this current session
        token: token,
      });

      // until the session times out, then the session resets
      // check if the user is authenticated using req.session
      // clears out data in the session if inactivity
      req.session.userToken = token;
  
      console.log(req.session);
      res.status(201).json({
        token,
        status: "success",
        code: 201,
        data: {
          message: "Registration successful",
        },
      });
    } catch (err) {
      next(err);
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      //   calls the database and looks for user
      const singleUser = await Users.findOne({ email: email });
      if (!singleUser) {
        res.json({ message: "No user found in the database" });
        return;
      }
      // bcrypt can be used to check if password checks out
      const validatingPW = await singleUser.checkPassword(password);
      if (!validatingPW) {
        res.json({ message: "Wrong Password" });
        return;
      }
      // to create a new token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });
      // mongodb syntax to add the token to database (old way)
      // user.token = token;
      // await user.save();

      // this is the new way = make a new session token
      //   tells the user that we are authenticated and signed in
      req.session.userToken = token;
      res.json({ token });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
  async logout(req, res) {
    if (req.session.userToken) {
      req.session.destroy(() => {
        res.json({ message: "User was signed out" });
      });
    } else {
      res.json({ message: "You are already signed out!" });
    }
  },
};

module.exports = usersController;
