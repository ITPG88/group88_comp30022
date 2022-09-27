const express = require('express');
const mongoose = require('mongoose');
const Review = require('./../model/review');
const Subject = require('./../model/subject');
const Comment = require('./../model/comment');
const router = express.Router();

router.get('/home/flagged_review', async (req,res) =>{
    const reviews = await Review.find().populate('subject')
    res.render('moderator/flagged_review', { reviews:reviews })
})

module.exports = router