const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  fieldsOfInterest: [String],
  likedList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
