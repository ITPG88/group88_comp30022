const Review = require('../model/review');
const Comment = require('../model/comment');


/**
 * @description Assumes that review has been accessed by route with /reviews/:id, and as such req.params should contain
 * an id.
 * @param req Request
 * @param res Response sent
 * @returns {Promise<void>}
 */
const getReviewWithID = async (req, res) => {
    const reviewID = req.params.reviewID;

    await Review.findById(reviewID).then(data => {
        if (!data){
            res.status(404).send({message: `Review with id ${reviewID} not found.`});
        } else {
            res.send(data);
        }
    }).catch(err =>{
        res.status(500).send({message:"Error retreiving review with id =" + reviewID})
    });
}


/**
 * For use of lookup of all subjects matching some query, not a search term. This is for looking up subjects by
 * author, subject, status or fieldOfStudy.
 * @param req Request containing query in body.
 * @param res
 */
const getReviewViaQuery = async (req, res) => {
    const query = req.body;

    await Review.find(query).then(data => {
        res.send(data);
    }).catch(err =>{
        res.status(500).send({message: `Error retrieving reviews based on parameters: ${query}.`});
    });

}

const getReviewViaSearch = async (req, res) => {

}

async function getReviewComments(commentsIDArray){
    let comments = []

    for (let i = 0; i < comments.length; i++){
        comments[i] = await Comment.findById(commentsIDArray[i]);
    }

    return comments;
}

/**
 * @description Retrieves the appropriate data for the homepage. If no user provided, simply returns first 10 reviews
 * in database. If moderator given, returns flagged reviews. If student given, returns liked list.
 */
const getHomePageReviews = async (req, res) => {

    if (!req.body.hasOwnProperty('user')){
        // Non-user logic
        await Review.find().then(data =>{
            res.send(data);
        }).catch(err =>{
            res.status(500).send({
                message: err.message||"Error occurred while retrieving data"
            });
        });
    } else {
        // User logic
        if (req.body.user.type === 'moderator') {
            await Review.find({$or:[{status: "REQUIRES_SUBJECT_REVIEW"},{status: "FLAGGED"}]}).then(data =>{
                res.send(data);
            }).catch(err =>{
                res.status(500).send({
                    message: err.message||"Error occurred while retrieving data"
                });
            });
        } else {
            await Review.find({author: req.body.user._id}).then(data =>{
                res.send(getReviewsFromID(data));
            }).catch(err =>{
                res.status(500).send({
                    message: err.message||"Error occurred while retrieving data"
                });
            });
        }
    }
}

async function getReviewsFromID (reviewIDList){
    let reviews = []

    for (let i = 0; i < reviews.length; i++){
        reviews[i] = await Review.findById(reviewIDList[i]);
    }

    return reviews;
}

