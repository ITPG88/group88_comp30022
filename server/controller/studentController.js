const User = require('../model/user');
const expressValidator = require('express-validator')

const getCurrentStudent = async (req) => {
    const userId = req.user._id
    const student = await User.findOne({userId: userId}).lean()
    return student
}

const getReviewSortByTime = async (req) => {
    try { 
        var reviews = await Review.find().sort('-createdAt').lean()
        for (let i = 0; i < reviews.length; i++) {
            // Change the format of createAt to YYYY/MM/DD
            reviews[i].createdAt = reviews[i].createdAt.toISOString().split('T')[0]
        }
        return res.render('APAGE', { layout: false , reviews: reviews}) 
    } catch (err) { 
        return next(err) 
    }
}


/**
 * @description: Creates a new student-user. Expects well formed student created from sign-up.
 * @method POST 
 */
const createNewStudent = (req, res) => {
    if(!req.body){
        res.status(400).send({ message : "Content can not be empty!"});
        return;
    }

    if(req.body.type === "moderator"){
        res.status(400).send({ message : "Error, moderator creation attempted."});
        return;
    }

    const query = { username: req.body.username, email: req.body.email};

    const result = User.find(query).toArray(function(err, result){
        if (err){
            throw err;
            return;
        }
        console.log(result);
    });
    
    if (result){
        console.log(`${req.body.username} or ${req.body.email} already exist in user database.`);
    }


    const student = new Student({
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        fieldsOfInterest: req.body.fieldsOfInterest,
        likedList: req.body.likedList
    });
    
    student.save(student)
    .then(data => {
        //res.send(data)
        //res.redirect('/add-user');
    })
    .catch(err =>{
        res.status(500).send({
            message : err.message || "Some error occurred while creating a create operation"
        });
    });
}

module.exports = {
    getCurrentStudent,
    getReviewSortByTime,
}
