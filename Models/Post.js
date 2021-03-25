const mongoose = require('mongoose');

const post = new mongoose.Schema({
    postId: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true,
        min: 1,
        max: 150
    },
    upvotes: {
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model('post', post, 'post');