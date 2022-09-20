const Student = require('../model/user').Student;
const User = require('../model/user').User;
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
    User.find(query).then(data => {
        console.log(data);
        if (data !== []){
            console.log(`${req.body.username} or ${req.body.email} already exist in user database.`);
            res.status(400).send({ message : "Error, username or email already exist in database"});
            return;
        }
        console.log("here")
        Student.create(req.body).catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

    });

}

/**
 * @description: updates modifiable fields of a student-user object. Req.body must contain userID field containing
 * ID of user
 * @method PATCH
 * @param req
 * @param res
 */
const updateStudentUser = async (req, res) => {

    /* This method expects a patch request containing the field(s) to be updated, and the userID to be provided
    ex:
    req.body = {
                 password: "thisIsMyNewPassword",
                 userID: ObjectID ('6329172f237b056836e960f1') - an objectID from the userDB
               }
     */
    const userID = req.body.userID;


    await Student.findByIdAndUpdate(userID, req.body).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Cannot update user with ${userID}. Is the user id correct?`
            });
        } else {
            console.log("updating");
            res.send(data);
        }
    }).catch(err =>{
    res.status(500).send({message: `Error in updating user information`});
    });
}

module.exports = {
    getCurrentStudent,
    getReviewSortByTime,
    createNewStudent,
}
