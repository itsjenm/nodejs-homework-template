// connects MongoDB to JS
const mongoose = require("mongoose");
// library that lets you hide data
require("dotenv").config();

async function database() {
  try {
    await mongoose.connect(process.env.DB_HOST);
    console.log("Database connection successful");
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
}

database();

module.exports = mongoose.connection;
