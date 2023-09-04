// const fs = require('fs/promises')
// models = table creations 
const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
  password: {
    type: String, 
    required: [true, 'Password is required'],
  },
  email: {
    type: String, 
    required: [true, 'Email is required'],
    unique: true, 
  }, 
  subscription: {
    type: String, 
    enum: ['starter', 'pro', 'business'],
    default: "starter"
  },
//   not best practice, but required for HW
  token: {
    type: String, 
    default: null,
  }, 
  owner: {
    type: Schema.Types.ObjectId, 
    ref: 'user',
  },
  verify: {
    type: Boolean, //A value of the verify field equal to false will mean that his email has not been verified yet.
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
  avatarURL: String,
}, { collection: 'user'})

// creating a method with the schema class
usersSchema.methods.checkPassword = async function(loginPW) {
    return bcrypt.compare(loginPW, this.password);
}


const Users = model('user', usersSchema); 

module.exports = Users; 