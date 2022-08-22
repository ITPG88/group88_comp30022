import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: mongoose.Schema.Types.ObjectId, ref : 'User'
})

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: mongoose.Schema.Types.ObjectId, ref : 'User',
    isPrivate: {
        type: Boolean,
        required: true
    },
    subjectCode: String,
    rating: {
        type: Number,
        required: true
    },
    comments: [commentSchema]
});

const Review = mongoose.model('Review', reviewSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {Review, Comment}