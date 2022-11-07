const Student = require('../model/user').Student
const User = require('../model/user').User
const Review = require('../model/review').Review
const nodemailer = require('nodemailer')

const Chars =
  '0123456789abcdefghijklmnopqrstuvwxyz~!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const PasswordLength = 15

exports.createStudent = (req, res, next) => {
  const { username, fullName, email, password } = req.body
  const errors = []

  if (!username || !fullName || !email || !password) {
    errors.push('All fields required')
  }

  if (req.body.password.length < 5) {
    errors.push('Password should be at least 5 characters')
  }
  if (!ValidateEmail(email)) {
    errors.push('Needs to be a unimelb email')
  }
  if (errors.length > 0) {
    console.log('We get here :(')
    console.log(errors)
    res.render('signup.ejs', {
      errors,
      fullName,
      email,
      username
    })
    return
  }

  const query = {
    $or: [{ username }, { email }]
  }
  Student.findOne(query).then((data) => {
    console.log(data)
    if (data) {
      errors.push('Username or Email is already exists')
      res.render('signup.ejs', {
        errors,
        fullName,
        email,
        username
      })
      return
    }
    console.log('here')

    Student.create(req.body)
      .then((data) => {
        next()
        // req.flash("success_msg", "You are now registered.");
      })
      .catch((err) => {
        console.log('Error detected')
        res.status(500).send({
          message:
            err.message ||
            'Some error occurred while creating a create operation'
        })
      })
  })
}

exports.getStudentReviews = async (req, res) => {
  let reviews = []
  if (req.user.likedList.length > 0) {
    for (const reviewID of req.user.likedList.length) {
      const review = await Review.findById(reviewID).populate('subject')
      reviews.push(review)
    }
  } else {
    reviews = await Review.find().populate('subject').limit(12)
  }
  res.render('student/home', { reviews })
}

exports.editStudentFieldsOfInterest = async (req, res) => {
  console.log(req.body)
  const username = req.user.username

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    console.log('Object missing')
    res.redirect('/logout')
    return
  }
  const fieldsofInterest = []
  for (const code in req.body) {
    fieldsofInterest.push(code)
  }
  await Student.findOneAndUpdate(
    { username },
    { fieldsOfInterest: fieldsofInterest }
  )
  res.redirect('/logout?signedup')
}

exports.resetPassword = async (req, res) => {
  const newPassword = req.body.password
  await Student.findOneAndUpdate(
    { _id: req.user._id },
    { password: newPassword }
  )
  res.redirect('/login', { message: 'Password reset. Please login.' })
}

exports.sendEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'subject_reviews@outlook.com',
      pass: '88comp30022'
    }
  })

  const email = req.body.email

  let user = await User.findOne({ email }).lean()
  res.locals.user = user

  if (user) {
    // generate random password
    let newPassword = ''
    for (let i = 0; i <= PasswordLength; i++) {
      const randomNumber = Math.floor(Math.random() * Chars.length)
      newPassword += Chars.substring(randomNumber, randomNumber + 1)
    }
    console.log('new password:' + newPassword)

    await Student.findOneAndUpdate({ _id: user._id }, { password: newPassword })

    user = await User.findOne({ email }).lean()
    console.log(user)

    const mailOptions = {
      from: 'subject_reviews@outlook.com',
      to: email,
      subject: 'password recovery',
      text: 'new password for your students review account',
      html:
        '<p>There is your new password which is auto generated by the server:</p><p>' +
        newPassword +
        '</p>'
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        const error = JSON.parse('{"error":"Fail to send the verification email"}')
        res.render('login.ejs', { error })
      } else {
        res.render('./email_sent', { email })
      }
    })
  } else {
    const error = JSON.parse('{"error":"Cannot find an account associated to this email"}')
    res.render('login.ejs', { error })
  }
}

// Password and email functions
// validate email
function ValidateEmail (email) {
  const STUDENT_EMAIL = 'student.unimelb.edu.au'
  // RFC-5322 Email regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (emailRegex.test(email)) {
    if (email.endsWith(STUDENT_EMAIL)) return true
  }
  return false
}
exports.sendPasswordEmailLink = async (req, res) => {}

exports.ValidateEmail = ValidateEmail
