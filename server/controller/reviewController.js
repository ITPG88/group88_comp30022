const Review = require('../model/review');


const getReviewWithID = async (req, res) => {
    const reviewID = req.params.reviewID;

    await Review.findById(reviewID).then(data => {
        if (!data){
            res.status(404).send({message: `Review with id ${} not found.`});
        } else {
            res.send(data);
        }
    }).catch( err =>{
        res.status(500).send({message:"Error retreiving review with id =" + reviewID})
    });
}

function getReviewComments(commentsIDArray){

}