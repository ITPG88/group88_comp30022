const User = require('../model/user').User
const Student = require('../model/user').Student
const ValidateEmail = require('../controller/loginController').ValidateEmail
exports.getFieldsOfInterest = async (req, res, next) => {
  const studentID = req.user._id
  const student = await Student.findById(studentID).lean()
  res.locals.fieldsOfInterest = student.fieldsOfInterest

  next()
}

exports.editFieldsOfInterest = async (req, res) => {
  console.log(req.body)
  const studentID = req.user._id
  if (!req.body) {
    return
  }

  const fieldsOfInterest = []

  for (const interest in req.body) {
    if (!fieldsOfInterest.includes(interest)) {
      fieldsOfInterest.push(interest)
    }
  }

  await Student.findOneAndUpdate({ _id: studentID }, { fieldsOfInterest })
  res.redirect('/settings/interest_areas')
}

exports.editAccountSettings = async (req, res) => {
  if (!req.body) {
    res.redirect('/account')
    return
  }

  console.log(req.body)

  if (req.body.email && req.user.type === 'moderator') {
    console.log('Moderator email change attempted.')
    res.status(500).send({ message: 'Illegal modification attempted' })
    return
  }

  const userID = req.user._id
  const user = await User.findById(userID)
  const fields = {}
  let error

  if (req.body.fullName) {
    fields.fullName = req.body.fullName
  }
  if (req.body.email) {
    if (ValidateEmail(req.body.email)) {
      fields.email = req.body.email
    } else {
      error = JSON.parse('{"error":"Needs to be a unimelb email"}')
      res.render('student/account_setting.ejs', { user, error })
      return
    }
  }

  const newPassword = req.body.password
  if (newPassword) {
    if (newPassword.length < 5) {
      error = JSON.parse('{"error":"Password should be at least 5 characters"}')
      res.render('student/account_settings.ejs', { user, error })
      return
    } else {
      await Student.findOneAndUpdate({ _id: userID }, { password: newPassword })
      res.redirect('/account')
      return
    }
  }

  await User.findByIdAndUpdate(userID, fields)
    .then((data) => {
      if (req.body.fullName) {
        req.user.fullName = req.body.fullName
      } else {
        req.user.email = req.body.email
      }
      res.redirect('/account')
    })
    .catch((err) => {
      console.log('Error detected')
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while creating a updating user fields.'
      })
    })
}
