const Review = require("../model/review").Review;
const Comment = require("../model/comment");
const PendingReview = require("../model/review").PendingReview;
const Subject = require("../model/subject");
const User = require("../model/user").User;
const Student = require("../model/user").Student;
const mongoose = require("mongoose");

/**
 * @description Helper function that gets reviews based on fieldsOfInterest.
 *
 */
async function getReviewsByFieldOfInterest(req) {
  let reviews = [];
  let subjectIDs = [];
  let fieldsOfInterest = (await Student.findById(req.user._id))
    .fieldsOfInterest;
  /*
  if (fieldsOfInterest) {
    fieldsOfInterest.forEach((field) => {
      subjectIDs.push(Subject.find({fieldOfStudy: field}));
    });
  }

  for (const subjectID of subjectIDs) {
    const review = await Review.find({ subject: subjectID }).populate('subject').limit(5);
    reviews.push(review);
  }
  return reviews;*/
  return [];
}

/**
 * @description Gets a subject ID from subject code
 */
async function findSubjectID(subjectCode) {
  let retVal = "";
  let subject;

  if ((subject = await Subject.findOne({ subjectCode: subjectCode }))) {
    retVal = subject._id;
  }

  return retVal;
}

/*
STUDENT(and guest)-CALLED FUNCTIONS
 */
exports.getHomepageReviews = async (req, res) => {
  let reviews = [];
  res.locals.title = "home";
  if (req.user) {
    console.log(req.user);
    if (req.user.type === "student") {
      const likedReviews = await Student.findById(req.user._id)["likedList"];
      if (likedReviews) {
        likedReviews.forEach((reviewID) => {
          reviews.push(Review.findById(reviewID).populate("subject"));
        });
      }
      // If no liked reviews, try field of interest
      if (reviews.length === 0) {
        reviews = await getReviewsByFieldOfInterest(req);
        // If no field of interest, default
        if (reviews.length === 0) {
          reviews = await Review.find().populate("subject").limit(19);
        }
        res.render("student/home", { reviews: reviews });
      }
    } else {
      // Moderator
      res.redirect("/home/flagged");
      return;
    }
  } else {
    // Guest
    reviews = await Review.find().populate("subject").limit(20);
    res.render("guest/home", { reviews: reviews });
  }
};
exports.getBrowsePageReviews = async (req, res) => {
  const reviews = await getReviewsByFieldOfInterest(req);
  console.log(reviews);
  res.render("student/browse", { title: "browse", reviews: reviews });
};

exports.getHistoryReviews = async (req, res) => {
  if (req.user.type === "moderator") {
    // Moderator has no history, should be redirected to home
    res.redirect("/home");
    return;
  }
  const query = { author: req.user._id };
  const reviews = await Review.find(query).populate("subject");
  const comments = await Comment.find(query);
  res.render("student/history", {
    title: "history",
    reviews: reviews,
    comments: comments,
  });
};
exports.setFullName = async (req, res, next) => {
  if (req.user) res.locals.fullName = req.user.fullName;
  next();
};

/**
 * @description Attempts a post review given a request created from write_review
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.postReview = async (req, res) => {
  let errors = [];
  const content = req.body.content;
  const author = req.user._id;
  const subjectCode = req.body.subjectCode;
  const rating = req.body.rating;
  const subjectResult = req.subject;
  if (req.user.type === "moderator") {
    // Moderator has no post review capability, should be redirected to home
    res.redirect("/home");
    return;
  }

  if (!content || !subject || !rating) {
    console.log("no either one");
    errors.push({ message: "Not all fields correctly filled" });
  }

  if (!author) {
    console.log("no author!");
    errors.push({ message: "Author identification error" });
  }
  console.log(errors);
  if (errors.length > 0) {
    console.log("Review creation field error.");
    res.render("student/write_review", {
      errors,
      content,
      subject,
    });
    return;
  }
  console.log(subjectResult);
  if (!subjectResult) {
    // Needs moderator attention
    let pendingReviewObj = {
      content: content,
      subject: subjectResult,
      author: req.user._id,
      isPrivate: false,
      isVisible: false,
      rating: rating,
      comments: [],
      attemptedCode: subjectCode,
      status: "REQUIRES_SUBJECT_REVIEW",
    };
    pendingReview.create(pendingReviewObj).catch((err) => {
      console.log(err);
      res.render("student/write_review", { review: reviewObject });
    });
    console.log("Subject created with faulty code");
    res.redirect("/subject/" + subjectCode);
  } else {
    let reviewObject = {
      content: content,
      subject: subjectResult,
      author: req.user._id,
      isPrivate: req.body.private === "on",
      isVisible: req.body.visible === "on",
      rating: rating,
      comments: [],
    };

    try {
      let review = await Review.create(reviewObject);
      review = review.save();
      res.redirect("/home");
    } catch (err) {
      console.log(err);
      res.render("student/write_review", { review: reviewObject });
    }
    res.redirect("/subject/" + subjectCode);
  }
};

exports.deleteReview = async (req, res) => {
  if (!req.user) {
    // Guest handling
  }
  const reviewID = req.params._id;
  if (req.user.type === "moderator" || req.user._id === reviewID) {
    // Authorised
  } else {
    // Not authorised
  }
};

/*
MODERATOR-CALLED FUNCTIONS
Re-direct students away from these
 */
exports.getFlaggedReviews = async (req, res) => {
  if (req.user.type === "student") {
    console.log("Student attempted to enter moderator area");
    res.redirect("/home");
    return;
  }

  const flaggedReviews = await PendingReview.find({ status: "FLAGGED" })
    .populate("subject")
    .populate("author");
  res.render("moderator/flagged_review", {
    reviews: flaggedReviews,
    flaggedReviewCount: flaggedReviews.length,
  });
};

exports.getPendingSubjectReviews = async (req, res) => {
  if (req.user.type === "student") {
    console.log("Student attempted to enter moderator area");
    res.redirect("/home");
    return;
  }

  const pendingSubjectReviews = await PendingReview.find({
    status: "REQUIRES_SUBJECT_REVIEW",
  })
    .populate("subject")
    .populate("author");
  res.render("moderator/home_new_subject", {
    pendingReviews: pendingSubjectReviews,
    flaggedReviewCount: pendingSubjectReviews.length,
  });
};

exports.deleteFlaggedPendingReview = async (req, res) => {
  //console.log("i am in remove moderator")
  if (req.user.type === "student") {
    console.log("Student attempted to enter moderator area");
    res.redirect("/home");
    return;
  }

  const pendingReview = await PendingReview.findByIdAndDelete(req.params.id);
  res.redirect("/home/flagged");
};

exports.neglectFlaggedPendingReview = async (req, res) => {
  console.log("in neglect");
  const review = await PendingReview.findById(req.params.id);
  let reviewObject = {
    content: review.content,
    subject: review.subject,
    author: review.author,
    isPrivate: review.isPrivate,
    isVisible: review.isVisible,
    rating: review.rating,
    comments: review.comments,
  };
  await Review.create(reviewObject);
  await PendingReview.findByIdAndDelete(req.params.id);
  res.redirect("/home/flagged");
};
