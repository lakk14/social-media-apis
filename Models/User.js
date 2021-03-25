const mongoose = require('mongoose');
const Post = require('./Post').schema;


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        max: 128,
        unique: true
    },
    followers: {
        type: [String]
    },
    following: {
        type: [String]
    },
    post: [Post]

});

module.exports = mongoose.model('User', userSchema, 'users');