// library that allows us to connect to mongoose library
const mongoose = require('mongoose');
// to hide sensative data
require('dotenv').config();

async function database() {
    try {
        await mongoose.connect(process.env.DB_HOST);
        console.log('Database connection successful')
    } catch (error) {
        process.exit(1);
    }
}

database();

module.exports = mongoose.connection; 