const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// by default, express cannot grab files from a request so we need multer
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
// why? with multer or any kind of file over, all files might be sent to temp folder
const uploadPath = path.join(process.cwd(), "tmp"); // checks/validation folder to see storage size and if it meets criteria
const imagesPath = path.join(process.cwd(), "public/avatars"); // storing/resting place for the files

// console.log(imagesPath);
// console.log(uploadPath)

const contactsController = {
  async getUsers(req, res) {
    try {
      // using firestore data to retrieve the users instead of mongoDB
      // const query = await getDocs(collection(db, 'users'));
      // const data = [];
      // query.forEach(doc => {
      //   data.push(doc.data());
      // });
      // res.json(data);
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
      // user's id
      const userId = await Users.owner;
      // generate a profile url based on email using gravatar
      const profileUrl = gravatar.profile_url(email, { format: "jpg" });
      //   create the user to target table and columns they are supposed to be in.
      //   .create adds to the db
      const newUser = await Users.create({
        email: email,
        // REMEMBER: You don't want to send the hashed password in the response, even if its hashed
        password: hashed,
        //data that verifies if they are in the application in this current session
        token: token,
        avatarURL: profileUrl,
        _id: userId,
      });

      // until the session times out, then the session resets
      // check if the user is authenticated using req.session
      // clears out data in the session if inactivity
      req.session.userToken = token;

      console.log(req.session);
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
  async logout(req, res) {
    try {
      if (req.session.userToken) {
        req.session.destroy(() => {
          res.json({ message: "User was signed out" });
        });
      } else {
        res.json({ message: "You are already signed out!" });
      }

      // try {
      //   await signOut(auth);
      //   res.json({ message: 'You are signed out'});
    } catch (err) {
      res.json(err);
    }
  },
  async uploadFile(req, res) {
    try {
      // create a storage
      const storage = multer.diskStorage({
        // where do we want the uploaded files to be at
        // destination/multer needs a callback function = cb
        destination: (req, file, cb) => {
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      });
      const upload = multer({
        storage: storage,
        limits: {
          fileSize: 1048576, // means 1MB
        },
      });
      // before we upload, lets rename
      // 1. we target a user

      const user = await Users.findOne({
        _id: "64e724b764ffa2392a7c5ef9",
      });
      console.log(user.id);

      // chain with another function
      // 2. target picture
      upload.array("picture")(req, res, async function (err) {
        // rename picture to tempName
        const { path: tempName } = req.file;
        console.log(tempName);

        // 3. make a new file name
        const fileName = path.join(imagesPath, user.id) + ".jpg";
        console.log(fileName);

        // read the picture and set dimensions
        Jimp.read(tempName)
          .then((image) => {
            // Do stuff with the image.
            image.resize(250, 250);
          })
          .catch((err) => {
            // Handle an exception.
            console.log(err);
          });

        // 4. move the image over using fs library
        await fs.rename(tempName, fileName);

        res.json(req.file);
      });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
  async updateFile(req, res) {
    try {
      const user = await Users.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );

      res.json(user);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
};

module.exports = contactsController;
