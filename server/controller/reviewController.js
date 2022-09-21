const Review = require('../model/review');
const Comment = require('../model/comment');


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

    for (let i = 0; i < comments.length, i++){
        comments[i] = await Comment.findById(commentsIDArray[i]);
    }

    return comments;
}

