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
            ref: 'Student'
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
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    },
    {
        timestamps: true,
    }
);

const badReviewSchema = new extendSchema(reviewSchema,
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
const BadReview = mongoose.model('BadReview', badReviewSchema, 'badReviews');

module.exports = {Review, BadReview};