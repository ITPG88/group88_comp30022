const express = require('express');
const mongoose = require('mongoose');
const Review = require('./../model/review');
const Subject = require('./../model/subject');
const Comment = require('./../model/comment');
const router = express.Router();

router.get('/', async (req,res) => {
    const reviews = await Review.find().populate('subject').exec();
    res.render('student/home', { reviews : reviews })
    // in index
})

router.get('/home', async (req,res) => {
    const reviews = await Review.find().populate('subject').exec();
    res.render('student/home', { reviews : reviews })
    // in index
})

router.get('/browse', (req,res) => {
    res.render('student/browse')
})

router.get('/history', async (req,res) => {
    const reviews = await Review.find().populate('subject');
    res.render('student/history', { reviews : reviews })
})

router.get('/write_review', (req,res) => {
    res.render('student/write_review', {review : new Review()})
})

router.get('/subject/:subjectCode/view_review/:id', async (req,res) => {
    const review = await Review.findById(req.params.id)
    res.render('student/view_review', { review : review })
})

router.post('/subject/:subjectCode/view_review/:id', async (req,res) => {
    const new_comment = new Comment({content: req.body.comment})
    const review = await Review.findById(req.params.id).populate('comments').exec()
    review.comments.push(new_comment);
    review.save();
    review.comment_content.push({content : review.comments[0].content , comment_id : review.comments[0]._id})
    //console.log(review.comment_content)
    res.redirect(`/student/subject/${review.subjectCode}/view_review/${review.id}`)
})

router.delete('/subject/:subjectCode/view_review/:id/:commentid', async (req,res) => {
    //console.log(req.params.commentid)
    //await Review.comment_content.findByIdAndDelete(req.params.commentid)
    const review = await Review.findById(req.params.id)
    for (let i =0; i < review.comment_content.length; i++){
        if(review.comment_content[i]._id == req.params.commentid){
            review.comment_content.splice(i, 1);
            review.save();
        }
    }
    console.log(review.comment_content)
    res.redirect(`/student/subject/${req.params.subjectCode}/view_review/${req.params.id}`)
})

router.get('/subject/:subjectCode/:id', async (req,res)=>{
    const review = await Review.findById(req.params.id)
    const result = await Subject.find({subjectCode : review.subjectCode})
    const same_subjectcode = await Review.find({subjectCode : review.subjectCode})
    //console.log(review.subjectName)
    //res.send(req.params.id)
    res.render('student/view_subject', { result:result[0], same_subjectcode : same_subjectcode})
})

router.get('/subject/:subjectCode', async (req,res)=>{
    const result = await Subject.find({subjectCode : req.params.subjectCode})
    //console.log(result)
    const same_subjectcode = await Review.find({subjectCode : req.params.subjectCode})
    res.render('student/view_subject', { result:result[0], same_subjectcode : same_subjectcode})
    //res.send(req.params.subjectCode)
})
    

router.get('/:id', async (req,res) =>{
    const review = await Review.findById(req.params.id).populate('subject').exec();
    
    if(review == null){
        res.redirect('/')
    }
    //res.send(req.params.id)
    //res.render('student/view_review', { review : review , same_subjectcode : same_subjectcode})
    res.redirect('/student/home')
})

router.post('/', async (req,res) =>{
    const result = await Subject.find({subjectCode : req.body.subjectCode})
    let review = new Review({   
        subject : result[0]._id,
        subjectCode : result[0].subjectCode,
        subjectName: result[0].subjectName,
        content: req.body.content,
        isPrivate: req.body.private == 'on',
        isVisible: req.body.visible == 'on',
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date()
    })
    try{
        review = await review.save()
        //console.log(review)
        res.redirect(`/student/${review.id}`)
    }catch(e){
        console.log(e)
        res.render('student/write_review', { review : review})
    }
    
})

router.delete('/subject/:subjectCode/:id', async (req,res)=>{
    await Review.findByIdAndDelete(req.params.id)
    res.redirect(`/student/subject/${req.params.subjectCode}`)
})

module.exports = router