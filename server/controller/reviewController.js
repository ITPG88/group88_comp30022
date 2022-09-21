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
    const reviewID = "vefve" //req.params.reviewID;

    return await Review.findById(reviewID).then(data => {
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

    return await Review.find(query).then(data => {
        res.send(data);
    }).catch(err =>{
        res.status(500).send({message: `Error retrieving reviews based on parameters: ${query}.`});
    });

}

const getReviewViaSearch = async (req, res) => {

}

async function getReviewComments(commentsIDArray){
    let comments = []

    for (let i = 0; i < comments.length, i++){
        comments[i] = await Comment.findById(commentsIDArray[i]);
    }

    return comments;
}

