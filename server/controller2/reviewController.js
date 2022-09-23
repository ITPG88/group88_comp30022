const Review = require("../model/review");
const Subject = require('../model/subject');
const User = require('../model/user').User;
const Student = require('../model/user').Student
const mongoose = require('mongoose');

/**
 * @desc: Helper function that gets reviews based on fieldsOfInterest.
 *
 */
async function getReviewsByFieldOfInterest(req){
    let reviews = [];
    let subjectIDs = []
    const fields = await Student.findById(req.user._id)["fieldsOfInterest"];

    if (fields){
        fields.forEach(field => {
            subjectIDs.push(Subject.find({fieldOfStudy: field}));
        });
    }

    for (const subjectID of subjectIDs) {
        const review = await Review.find({subject: subjectID}).limit(5);
        reviews.push(review);
    }

    return reviews;
}

exports.getHomepageReviews = async (req, res) => {
    let reviews = [];
    if (req.user){
        console.log(req.user);
        if (req.user.type === 'student'){
            const likedReviews = await Student.findById(req.user._id)["likedList"];
            console.log(likedReviews);
            if (likedReviews) {
                likedReviews.forEach(reviewID => {
                    reviews.push(Review.findById(reviewID))
                })
            }
            // If no liked reviews, try field of interest
            if (reviews.length === 0){
                reviews = await getReviewsByFieldOfInterest(req);
                // If no field of interest, default
                if (reviews.length === 0){
                    const query = {status: "APPROVED"};
                    reviews = await Review.find(query).limit(10);
                }
                res.render("student/home", {reviews: reviews});
            }
        } else {
            // Moderator
            const query = {status: {$ne : "APPROVED"}};
            reviews = await Review.find(query)
            res.render("moderator/homepage", {reviews: reviews});
        }
    } else {
        // Guest
        const query = {status: "APPROVED"};
        reviews = await Review.find(query).limit(10);
        res.render("guest/homepage", {reviews: reviews});
    }
}

exports.getBrowsePageReviews = async (req, res) => {
    const reviews = getReviewsByFieldOfInterest(req);
    res.render("student/browse", reviews);
}

exports.getHistoryReviews = async (req, res) => {
    if (req.user.type === 'moderator'){
        // Moderator has no history, should be redirected to home
        res.redirect('/home');
        return;
    }
    const query = {author: req.user._id}
    const reviews = await Review.find(query);
    res.render('student/history', {reviews: reviews});
}

exports.postReview = async (req, res) => {
    let errors = []
    const content = req.body.content;
    const author = req.user._id;
    const subject = req.body.subject;
    const rating = req.body.rating;

    if (req.user.type === 'moderator'){
        // Moderator has no post review capability, should be redirected to home
        res.redirect('/home');
        return;
    }

    if (!content || !subject || !rating){
        errors.push({message: "Not all fields correctly filled"});
    }

    if (!author){
        errors.push({message: "Author identification error"});
    }

    if (errors.length > 0){
        res.render("write_review.ejs", {
            errors,
            content,
            subject
        });
        return;
    }

    const subjectResult = await Subject.findOne({subjectCode : req.body.subjectCode})
    console.log(subjectResult._id);

    if (!subjectResult){
        // Needs moderator attention
        console.log("Subject created with faulty code");
    } else {
        let reviewObject = {
            content: content,
            subject: subjectResult,
            author: req.user._id,
            isPrivate: false,
            isVisible: true,
            rating: rating,
            comments: [],
            status: 'APPROVED'
        }
        Review.create(reviewObject).
        catch(err => {
            console.log(err)
            res.render('student/write_review', {review : reviewObject});
        });
    }

}