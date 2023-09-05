const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// all the options for the current session we are using
// session is maintaining whether user is logged in or not (auth)
const sesh = {
  secret: process.env.JWT_SECRET,
  cookies: {
    maxAge: 30000,
    httpOnly: true, //only http, if https (block it)
    secure: true,
    sameSite: 'strict' //only access samesite
  },
  resave: false,
  saveUninitialized: true, 
}

app.use(session(sesh));

app.use('/api', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
