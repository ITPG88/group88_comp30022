const express = require('express')
const Review = require('../server/model/review')
const Subject = require('../server/model/subject')
const router = express.Router();

router.get('/', async (req,res) => {
    const reviews = await Review.find().populate('subject')
    res.render('student/home', { reviews : reviews })
});

router.get('/home', async (req,res) => {
    const reviews = await Review.find().populate('subject')
    res.render('student/home', { reviews : reviews })
})

router.get('/browse', (req,res) => {
    res.render('student/browse')
})

router.get('/history', (req,res) => {
    res.render('student/history')
})

router.get('/write-review', (req,res) => {
    res.render('student/write-review', {review : new Review()})
})

router.get('/:id', async (req,res) =>{
    const review = await Review.findById(req.params.id)
    if(review == null){
        res.redirect('/')
    }
    //res.render('', { review : review })
})

router.post('/', async (req,res) =>{
    const subject = new Subject({ subjectCode: req.body.subjectcode})
    let review = new Review({
        subject: subject,
        content: req.body.content,
        isPrivate: false,
        isVisible: true,
        rating: 5
    })
    try{
        review = await review.save()
        res.redirect(`/student/${review.id}`)
    }catch(e){
        res.render('student/write-review', { review : review})
    }
    
})

module.exports = router