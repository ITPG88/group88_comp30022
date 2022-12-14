const mongoose = require('mongoose')
const extendSchema = require('mongoose-extend-schema')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  type: {
    type: String,
    enum: ['student', 'moderator'],
    default: 'student'
  }
})

const studentSchema = extendSchema(userSchema, {
  email: {
    type: String,
    required: true,
    unique: true
  },
  fieldsOfInterest: {
    type: [String],
    required: true,
    default: []
  },
  likedList: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    required: true,
    default: []
  },
  likedComments: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    required: true,
    default: []
  }
})

const moderatorSchema = extendSchema(userSchema, {})

// Password comparison function
// Compares the provided password with the stored password
// Allows us to call user.verifyPassword on any returned objects
userSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, valid) => {
    callback(err, valid)
  })
}

// Password salt factor
const SALT_FACTOR = 10
// Hash password before saving
studentSchema.pre('save', function save (next) {
  const user = this
  // Go to next if password field has not been modified
  if (!user.isModified('password')) {
    return next()
  }
  // Automatically generate salt, and calculate hash
  bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
    if (err) {
      return next(err)
    }
    // Replace password with hash
    user.password = hash
    next()
  })
})

studentSchema.pre('findOneAndUpdate', async function (next) {
  const user = this

  try {
    if (user._update.password) {
      const hash = await bcrypt.hash(user._update.password, SALT_FACTOR)
      user._update.password = hash
    }
    next()
  } catch (err) {
    return next(err)
  }
})

const User = mongoose.model('User', userSchema, 'users')
const Student = mongoose.model('Student', studentSchema, 'users')
const Moderator = mongoose.model('Moderator', moderatorSchema, 'users')

module.exports = { User, Student, Moderator }
