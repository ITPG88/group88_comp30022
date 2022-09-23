const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.mongo("Comment", commentSchema);