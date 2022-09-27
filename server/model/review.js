const mongoose = require('mongoose');
const extendSchema = require('mongoose-extend-schema');

const reviewSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        author : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        isPrivate: {
            type: Boolean,
            required: true,
            default: false,
        },
        isVisible: {
            type: Boolean,
            required: true,
            default: true,
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject"
        },
        rating: {
            type: Number,
            required: true,
        },
        nLikes: {
            type: Number,
            required: true,
            default: 0
        },
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    },
    {
        timestamps: true,
    }
);

const pendingReviewSchema = new extendSchema(reviewSchema,
    {
        attemptedCode: String,
        status: {
            type: String,
            enum: ["REQUIRES_SUBJECT_REVIEW", "FLAGGED"],
            default: "FLAGGED"
        },
    }
);



const Review = mongoose.model('Review', reviewSchema, 'reviews');
const PendingReview = mongoose.model('PendingReview', pendingReviewSchema, 'pendingReviews');

module.exports = {Review, PendingReview};
