const app= require('express').Router()
const subjectModel=require('../model/subject.model')
const lectureModel=require('../model/lecture.model')
const {
  verifyTokenFromBody, 
  verifyTokenAndAuthorization,
  verifyTokenAndDoctor,
  verifyToken
} = require('../middleware/auth')


app.post('/addSubject', async (req,res)=> {

try{
       subject={subject_name:req.body.subject_name,doctorId:req.body.doctorId}
   const newSubject=await subjectModel.create(subject)
 res.json(newSubject)
}catch(error){

    res.json({error})
}
  }
  )

  //to get all subjects
  app.get('/AllSubjects', verifyToken,async (req,res)=> {
 
 try{
  console.log('dddddddd')
    const subjects = await subjectModel.find().select("_id subject_name")
    console.log(subjects)
      res.json(subjects)
 
 }catch(error){
 
     res.json({error})
 }
   }
   )


   // to get subject
   app.get('/subject/:id', verifyToken,async (req,res)=> {
 
    try{
    await subjectModel.findOne({_id:req.params.id})
    .populate("lectures","_id file fileName") // key to populate
    .then(subjectModel => {
       res.json(subjectModel); 
    });

    }catch(error){
    
        res.json({error})
    }
      }
      )


  module.exports = app;
