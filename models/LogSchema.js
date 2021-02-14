const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userId: String,
    size: Number,
    time: Number,
    move: Number,
    rating: Number,
    createdAt: String,
    updatedAt: String
}, {
    versionKey: false,
    timestamps: true
});

const LogModel = mongoose.model('Log', logSchema);

module.exports = LogModel;