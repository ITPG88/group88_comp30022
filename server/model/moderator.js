const mongoose = require("mongoose");

const moderatorSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true,
        unique: true 
    }
});

const Moderator = mongoose.model('moderator', moderatorSchema);

module.exports = Moderator;