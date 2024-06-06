const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    UserID: String,
    UserName: String
}, { collection : 'Users' })

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;