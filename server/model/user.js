import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
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
    fieldsOfInterest: [{type: mongoose.Schema.Types.ObjectId, ref : 'Subject'}]
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

const User = mongoose.model('User', userSchema);
const Moderator = mongoose.model('Admin', moderatorSchema);

module.exports = {User, Moderator}