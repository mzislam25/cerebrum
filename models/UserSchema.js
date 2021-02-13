const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    user_record: Number,
    createdAt: String,
    updatedAt: String
}, {
    versionKey: false,
    timestamps: true
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;