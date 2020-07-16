const mongoose = require('mongoose');

module.exports = mongoose.model('users', {
    firstName: String,
    lastName: String,
    username: String,
    password: String,
});