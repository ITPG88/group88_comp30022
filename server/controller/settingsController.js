const User = require("../model/user").User;
const Student = require("../model/user").Student;

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

  await Student.findOneAndUpdate(
    { _id: studentID },
    { fieldsOfInterest }
  )
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
  const fields = {}
  if (req.body.fullName) {
    fields.fullName = req.body.fullName
  }
  if (req.body.email) {
    if (validateEmail(req.body.email)) {
      fields.email = req.body.email
    } else {
      return
    }
  }

  await User.findByIdAndUpdate(userID, fields)
    .then(data => {
      if (req.body.fullName) {
        req.user.fullName = req.body.fullName
      } else {
        req.user.email = req.body.email
      }
      res.redirect('/account')
    }).catch(err => {
      console.log('Error detected')
      res.status(500).send({
        message:
                err.message ||
                'Some error occurred while creating a updating user fields.'
      })
    })
}

