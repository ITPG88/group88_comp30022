const mongoose = require("mongoose");
const extendSchema = require('mongoose-extend-schema');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum : ['student', 'moderator'],
    default: 'student'
  }
});

const studentSchema = extendSchema(userSchema, {
  email: {
    type: String,
    unique: true,
  },
  fieldsOfInterest: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  likedList: [{type: mongoose.Schema.Types.ObjectId, ref: "Review"}]
});

const moderatorSchema = extendSchema(userSchema, {});


const User = mongoose.model("User", userSchema);
const Student = mongoose.model("Student", studentSchema);
const Moderator = mongoose.model("Admin", moderatorSchema);

module.exports = { User, Student, Moderator};
