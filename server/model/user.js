import mongoose from "mongoose";

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
    fieldOfStudy: String
});

const adminSchema = new mongoose.Schema({
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

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = {User, Admin}