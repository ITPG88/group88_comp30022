import mongoose, {mongo} from "mongoose";


const subjectSchema = new mongoose.Schema({
    subjectCode: String,
    subjectName: String,
    fieldOfStudy: String,
    university: String
});

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: mongoose.Schema.Types.ObjectId, ref : 'User'
});

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: mongoose.Schema.Types.ObjectId, ref : 'User',
    isPrivate: {
        type: Boolean,
        required: true,
        default: false
    },
    isVisible: {
        type: Boolean,
        required: true,
        default: true
    },
    subject: subjectSchema,
    rating: {
        type: Number,
        required: true
    },
    comments: [commentSchema]
});

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
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
    fieldsOfInterest: [subjectSchema]
});

const moderatorSchema = new mongoose.Schema({
    fullname : {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

const Review = mongoose.model('Review', reviewSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Subject = mongoose.model('Subject', subjectSchema);
const Moderator = mongoose.model('Moderator', moderatorSchema);
const User = mongoose.model('User', userSchema);

module.exports = {Review, Comment, Subject, Moderator, User}