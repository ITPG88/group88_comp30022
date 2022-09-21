const Moderator = require("../model/user").Moderator;
const Subject = require("../model/subject");


/**
 * @description Expects req.body to hold the result of the subjectCreation form for moderators.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createSubject = async (req, res) =>{
    return await Subject.create(req.body).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while attempting a create operation."
        });
    });
}