const express = require('express');
const mongoose = require('mongoose');
const Review = require("../model/review").Review;
const pendingReview = require("../model/review").PendingReview;
const Subject = require('./../model/subject');
const Comment = require('./../model/comment');
const router = express.Router();

router.get('/home/flagged_review', async (req,res) =>{
    const reviews = await Review.find().populate('subject')
    const flagged_review_count = await Review.find({status : "FLAGGED"}).count()
    console.log(flagged_review_count)
    res.render('moderator/flagged_review', { reviews:reviews , flagged_review_count:flagged_review_count})
})

module.exports = router