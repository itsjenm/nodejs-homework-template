const Users = require("../models/users");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs").promises;
const gravatar = require("gravatar");
const Jimp = require("jimp");
require("dotenv").config();

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

      // create a verification token using nanoid
      const verifyToken = await nanoid(32);
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
        token: null, //initialize with null as we'll set it later after verification
        avatarURL: avatarURL,
        // create a verification toke for the user and write it to the database (to generate a token)
        verificationToken: verifyToken,
      });

      // Create a transporter with your email service settings
      const transporter = nodemailer.createTransport({
        service: "gmail", // e.g., Gmail
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_APIKEY,
        },
        // configuration
        tls: {
          rejectUnauthorized: false,
        },
      });
      // create verification Link to send in the email
      const verificationLink = `http://localhost:3000/api/users/verify/${verifyToken}`;
      const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification",
        text: `Click the following link to verify your email: ${verificationLink}`,
      };
      // send the mail
      transporter.sendMail(message, (err, info) => {
        // ternarory operator conditional
        err
          ? console.error("Error sending email:", err)
          : console.log("Email sent", info);
      });

      //   create a token and store in db
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });

      newUser.token = token;
      await newUser.save();
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
  async resendEmail(req, res) {
    try {
      // gets body in email format
      const userEmail = req.body.email;
      const verifyToken = req.body.verificationToken;
      // if there is no required field email in body,
      // returns JSON with key {"message": ""}
      if (!userEmail) {
        res.status(400).json({ message: "missing required field email" });
      }
      // if everything is fine with body, resend the letter with verificationToken
      if (userEmail && req.body.verify === "false") {
        // create verification Link to send in the email
        const verificationLink = `http://localhost:3000/api/users/verify/${verifyToken}`;
        const message = {
          from: process.env.EMAIL,
          to: email,
          subject: "Email Verification",
          text: `Click the following link to verify your email: ${verificationLink}`,
        };
        // send the mail
        transporter.sendMail(message, (err, info) => {
          // ternarory operator conditional
          err
            ? console.error("Error sending email:", err)
            : console.log("Email sent", info);
        });
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      // const signedInUser = await signInWithEmailAndPassword(auth, email, password);
      // const user = signedInUser.user
      // if(!user.emailVerified) {
      //   res.json({ message: 'Please verify your email to continue'})
      // }
      // res.json(user.stsTokenManager);
      //   calls the database and looks for user
      const singleUser = await Users.findOne({ email: email });
      // checks if the email has been verified
      if (singleUser.verify === "false") {
        res.json({ message: "Please verify your email to continue" });
        return;
      }
      if (!singleUser) {
        res.status(400).json({
          status: "error",
          code: 400,
          message: "No user found in the database",
          data: "Bad request",
        });
        return;
      }
      // bcrypt can be used to check if password checks out
      const validatingPW = await singleUser.checkPassword(password);
      if (!validatingPW) {
        res.status(400).json({
          status: "error",
          code: 400,
          message: "Wrong Password",
          data: "Bad request",
        });
        return;
      }

      // to create a new token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });
      // mongodb syntax to add the token to database * needed to save to db to retrieve
      singleUser.token = token;
      await singleUser.save();

      // this is the new way = make a new session token
      //   tells the user that we are authenticated and signed in
      req.session.userToken = token;
      res.status(200).json({
        status: "success",
        code: 200,
        data: {
          token,
        },
      });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
};

module.exports = contactsController;
