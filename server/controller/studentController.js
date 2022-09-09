const User = require('../model/user');
const Review = require('../model/review');

const expressValidator = require('express-validator')

const getCurrentStudent = async (req) => {
    const userId = req.user._id
    const student = await User.findOne({userId: userId}).lean()
    return student
}

const getReviewSortByTime = async (req) => {
    try { 
        var reviews = await review.find().sort('-createdAt').lean()
        for (let i = 0; i < reviews.length; i++) {
            // Change the format of createAt to YYYY/MM/DD
            reviews[i].createdAt = records[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('doctorDashboard', { layout: false , reviews: reviews}) 
    } catch (err) { 
        return next(err) 
    }
}

module.exports = {
    getCurrentStudent,
    getReviewSortByTime,
}