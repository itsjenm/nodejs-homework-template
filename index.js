const nodemailer = require("nodemailer");
require("dotenv").config();

// transport key is where you connect everything
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jmartinez414@gmail.com",
    pass: process.env.EMAIL_APIKEY,
  },
  // configuration
  tls: {
    rejectUnauthorized: false,
  },
});
// message you are sending over
// put it inside a function
function sendMessage(email) {
  const message = {
    from: "jmartinez414@gmail.com",
    to: email,
    subject: "Learning nodemailer",
    text: "Hey, this is cool!",
  };
  // send the mail
transporter.sendMail(message, (err, info) => {
    // ternarory operator conditional
    err ? console.log(err) : console.log("Email sent", info);
  });
}

// const emails = [1, 2, 3, 4, 5]
// // loop through emails, and send them all a message
// emails.forEach(email => sendMessage(email));


