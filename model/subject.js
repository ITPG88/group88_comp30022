const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectCode: String,
    subjectName: String,
    fieldOfStudy: String,
    university: String
});

module.exports = mongoose.model("Subject", subjectSchema);