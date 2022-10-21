const Review = require('../model/review').Review
const Comment = require('../model/comment')
const PendingReview = require('../model/review').PendingReview
const Subject = require('../model/subject')
const Student = require('../model/user').Student

/*
STUDENT(and guest)-CALLED FUNCTIONS
 */
exports.getHomepageReviews = async (req, res) => {
  let reviews = []
  res.locals.title = 'home'
  if (req.user) {
    console.log(req.user)
    if (req.user.type === 'student') {
      const likedReviews = await Student.findById(req.user._id).likedList
      if (likedReviews) {
        likedReviews.forEach((reviewID) => {
          reviews.push(
            Review.findById(reviewID)
              .sort({ createdAt: -1 })
              .populate('subject')
          )
        })
      }
      if (reviews.length === 0) {
        reviews = await Review.find()
          .sort({ createdAt: -1 })
          .populate('subject')
          .limit(19)
      }
      res.render('student/home', { reviews })
    } else {
      // Moderator
      res.redirect('/home/flagged')
    }
  } else {
    // Guest
    reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('subject')
      .limit(20)
    res.render('guest/home', { reviews })
  }
}

/**
 *
 * @param req
 * @param res
 * @Description: retrieves the relevant reviews for a student user's browse page
 */
exports.getBrowsePageReviews = async (req, res) => {
  if (!req.user) {
    res.redirect('/home')
  }

  let reviews = []
  if (req.user.type === 'moderator') {
    // Moderators get most recent reviews
    reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('subject')
      .limit(25)
  } else {
    // Students get reviews from their interested field of study, then recent reviews
    const student = await Student.findById(req.user._id)
    const fieldsOfInterest = student.fieldsOfInterest
    const subjects = []
    for (const field of fieldsOfInterest) {
      const result = await Subject.find({ fieldOfStudy: field })
      for (const sub of result) {
        subjects.push(sub)
      }
    }

    for (const subject of subjects) {
      const result = await Review.find({ subject: subject._id })
        .populate('subject')
        .limit(4)
      reviews = reviews.concat(result)
    }
    if (reviews.length < 10) {
      reviews = reviews.concat(
        await Review.find()
          .sort({ nLikes: -1 })
          .populate('subject')
          .limit(15 - reviews.length)
      )
    }
  }
  res.render('student/browse', {
    title: 'browse',
    reviews,
    userType: req.user.type
  })
}

/**
 *
 * @param req
 * @param res
 * @description retrieves the reviews for a given student user's history page. Guest, moderator have no history,
 * redirect them.
 */
exports.getHistoryReviews = async (req, res) => {
  if (req.user.type === 'moderator') {
    // Moderator has no history, should be redirected to home
    res.redirect('/home')
    return
  }
  const query = { author: req.user._id }
  const reviews = await Review.find(query).populate('subject')
  const comments = await Comment.find(query)
  res.render('student/history', {
    title: 'history',
    reviews,
    comments
  })
}

exports.setFullName = async (req, res, next) => {
  if (req.user) res.locals.fullName = req.user.fullName
  next()
}

/**
 * @description Attempts a post review given a request created from write_review
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.postReview = async (req, res) => {
  const errors = []
  const content = req.body.content
  const author = req.user._id
  const subjectCode = req.body.subjectCode
  const rating = req.body.rating
  const subjectResult = req.subject
  if (req.user.type === 'moderator') {
    // Moderator has no post review capability, should be redirected to home
    res.redirect('/home')
    return
  }
  console.log(req.body)
  if (!content || !subjectCode || !rating) {
    console.log('no either one')
    errors.push({ message: 'Not all fields correctly filled' })
  }

  if (!author) {
    console.log('no author!')
    errors.push({ message: 'Author identification error' })
  }
  console.log(errors)
  if (errors.length > 0) {
    console.log('Review creation field error.')
    res.render('student/write_review', {
      errors,
      content,
      subjectCode
    })
    return
  }
  console.log(subjectResult)
  if (!subjectResult) {
    // Needs moderator attention
    const pendingReviewObj = {
      content,
      subject: subjectResult,
      author: req.user._id,
      isPrivate: req.body.private === 'on',
      isVisible: req.body.visible === 'on',
      rating,
      comments: [],
      attemptedCode: subjectCode,
      attemptedName: req.body.subjectName,
      attemptedfield: req.body.fieldofstudy,
      status: 'REQUIRES_SUBJECT_REVIEW'
    }
    await PendingReview.create(pendingReviewObj).catch((err) => {
      console.log(err)
      res.render('student/write_review', { review: pendingReviewObj })
    })
    console.log('Subject created with faulty code')
    res.redirect('/home')
  } else {
    const reviewObject = {
      content,
      subject: subjectResult._id,
      author: req.user._id,
      isPrivate: req.body.private === 'on',
      isVisible: req.body.visible === 'on',
      rating,
      comments: []
    }

    try {
      await Review.create(reviewObject)
      res.redirect('/home')
    } catch (err) {
      console.log(err)
      res.render('student/write_review', { review: reviewObject })
      res.redirect('/subject/' + subjectCode)
    }
  }
}

/**
 *
 * @param req
 * @param res
 * @description deletes a review given in a request
 */
exports.deleteReview = async (req, res) => {
  if (!req.user) {
    // Guest handling
  }
  const reviewID = req.params._id
  if (req.user.type === 'moderator' || req.user._id === reviewID) {
    // Authorised
  } else {
    // Not authorised
  }
}

/*
MODERATOR-CALLED FUNCTIONS
Re-direct students away from these
 */
exports.getFlaggedReviews = async (req, res) => {
  if (req.user.type === 'student') {
    console.log('Student attempted to enter moderator area')
    res.redirect('/home')
    return
  }

  const flaggedReviews = await PendingReview.find({ status: 'FLAGGED' })
    .populate('subject')
    .populate('author')
  res.render('moderator/flagged_review', {
    reviews: flaggedReviews
  })
}

exports.getPendingSubjectReviews = async (req, res) => {
  if (req.user.type === 'student') {
    console.log('Student attempted to enter moderator area')
    res.redirect('/home')
    return
  }

  const pendingSubjectReviews = await PendingReview.find({
    status: 'REQUIRES_SUBJECT_REVIEW'
  })
    .populate('subject')
    .populate('author')
  res.render('moderator/home_new_subject', {
    reviews: pendingSubjectReviews
  })
}

exports.neglectFlaggedPendingReview = async (req, res) => {
  console.log('in neglect')
  const review = await PendingReview.findById(req.params.id)
  const reviewObject = {
    content: review.content,
    subject: review.subject,
    author: review.author,
    isPrivate: review.isPrivate,
    isVisible: review.isVisible,
    rating: review.rating,
    comments: review.comments,
    createdAt: review.createdAt
  }
  await Review.create(reviewObject)
  await PendingReview.findByIdAndDelete(req.params.id)
  res.redirect('/home/flagged')
}
exports.deletePendingReview = async (req, res, next) => {
  // console.log("i am in remove moderator")
  if (req.user.type === 'student') {
    console.log('Student attempted to enter moderator area')
    res.redirect('/home')
    return
  }

  await PendingReview.findByIdAndDelete(req.params.id)
  next()
}

exports.approvePendingSubjectReview = async (req, res) => {
  console.log('i am in approve PS')
  // find pending review through review_id.
  const review = await PendingReview.findById(req.params.id)
  // Add approved subject to subject list.
  const subjectObject = {
    subjectCode: review.attemptedCode,
    subjectName: review.attemptedName,
    fieldOfStudy: review.attemptedfield,
    university: 'University of Melbourne'
  }
  await Subject.create(subjectObject)
  const newSubject = await Subject.find(subjectObject)
  console.log(newSubject)
  // review get added to student home.
  const reviewObject = {
    content: review.content,
    subject: newSubject[0],
    author: review.author,
    isPrivate: review.isPrivate,
    isVisible: review.isVisible,
    rating: review.rating,
    comments: review.comments,
    createdAt: review.createdAt
  }
  console.log()
  await Review.create(reviewObject)
  await PendingReview.findByIdAndDelete(req.params.id)
  res.redirect('/home/pending_subject')
}

exports.getNumPendingReviews = async (req, res, next) => {
  res.locals.newSubjectCount = await PendingReview.find({
    status: 'REQUIRES_SUBJECT_REVIEW'
  }).count()
  res.locals.flaggedReviewCount = await PendingReview.find({
    status: 'FLAGGED'
  }).count()
  next()
}

exports.editReviews = async (req, res, next) => {
  console.log('i am in edit review')
  const review = await Review.findById(req.params.id).populate('subject')
  console.log(req.params.id)
  res.render('student/edit_review', { review })
}

exports.editreviews = async (req, res, next) => {
  console.log('i am in edit review page')
  let review = await Review.findById(req.params.id).populate('subject')
  review.content = req.body.content
  review.isVisible = req.body.visible === 'on'
  review.isPrivate = req.body.private === 'on'
  review = await review.save()
  res.redirect('/history')
}
