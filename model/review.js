const mongoose = require('mongoose') 

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    isPrivate: {
        type: Boolean,
        required: true,
        default: false
    },
    isVisible: {
        type: Boolean,
        required: true,
        default: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    rating: {
        type: Number,
        required: true
    },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    status: {
        type: String,
        enum : ['APPROVED', 'REQUIRES_SUBJECT_REVIEW', 'FLAGGED'],
        default: 'APPROVED'
    }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;