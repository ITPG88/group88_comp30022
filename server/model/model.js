const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
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
    fieldOfStudy: String
});

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: userSchema,
    isPrivate: {
        type: Boolean,
        required: true
    },
    subjectCode: String,
    rating: {
        type: Number,
        required: true
    },
    comments: [commentSchema]
});

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: userSchema
})
