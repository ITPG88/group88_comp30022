const mongoose = require('mongoose')
const ExtendSchema = require('mongoose-extend-schema')

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
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
      ref: 'Subject'
    },
    rating: {
      type: Number,
      required: true
    },
    nLikes: {
      type: Number,
      required: true,
      default: 0
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment',
      required: true,
      default: []
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: { createdAt: false, updatedAt: true } }
)

const pendingReviewSchema = new ExtendSchema(reviewSchema, {
  attemptedCode: String,
  attemptedName: String,
  attemptedfield: String,
  status: {
    type: String,
    enum: ['REQUIRES_SUBJECT_REVIEW', 'FLAGGED'],
    default: 'FLAGGED'
  }
})

const Review = mongoose.model('Review', reviewSchema, 'reviews')
const PendingReview = mongoose.model(
  'PendingReview',
  pendingReviewSchema,
  'pendingReviews'
)

module.exports = { Review, PendingReview }
