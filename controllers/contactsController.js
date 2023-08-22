const Users = require("../models/users");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
// why? with multer or any kind of file over, all files might be sent to temp folder
// checks/validation folder to see storage size and if it meets criteria
const uploadPath = path.join(process.cwd(), "upload");
// storing/resting place for the files
const imagesPath = path.join(process.cwd(), "public/avatars");

// console.log(imagesPath);

const contactsController = {
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
      const user = await Users.findOne({
        _id: "64e27065fdb22b4d50c0ae70",
      });
      console.log(user.id);
      // chain with another function
      upload.single("picture")(req, res, async function (err) {
        const { path: tempName } = req.file;
        console.log(path);
        // upload to the images folder 
        // make a new filename
        const fileName = path.join(imagesPath, user.id) + '.jpg'; // path.join(directory, name of file)
        console.log(fileName);
        await fs.rename(tempName, fileName);
        res.json(req.file);
      });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
};

module.exports = contactsController;
