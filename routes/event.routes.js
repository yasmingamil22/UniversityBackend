const app= require('express').Router()

const eventModel=require('../model/event.model')
const subjectModel=require('../model/subject.model')

const persianJs =require('persianjs')




const {
    verifyTokenFromBody, 
    verifyTokenAndAuthorization,
    verifyTokenAndDoctor,
    verifyToken
  } = require('../middleware/auth')




app.post('/addEvent', verifyTokenAndDoctor, async (req,res)=> {
 //  2022/07/16 11:40:00"
    try{
    let subject=await subjectModel.findOne({doctorId:req.dataInToken.userId})
    const fromDate =req.body.from.substring(0,10)
    const fromTime =req.body.from.substring(11,19)

    const toDate =req.body.to.substring(0,10)
    const toTime =req.body.to.substring(11,19)

         await eventModel.insertMany({
            doctorId:req.dataInToken.userId,
            event_name:req.body.event_name,
            fromDate:fromDate,
            fromTime:fromTime,
            toDate:toDate,
            toTime:toTime,
            subject_name:subject.subject_name,
              })

              res.json({message:"done"})

 }catch(error){
     res.json({error})
 }
   }
   )



   
app.get('/allEvents', verifyToken, async (req,res)=> {

    try{

 await eventModel.find()
    .populate("doctorId","profile_photo profile_name -_id") // key to populate
    .then(eventModel => {
       res.json(eventModel); 
    });

         
 }catch(error){
     res.json({error})
 }
   }
   )


    
app.get('/event/:id', verifyToken, async (req,res)=> {

    try{

 await eventModel.findById(req.params.id)
    .populate("doctorId","profile_photo profile_name -_id") // key to populate
    .then(eventModel => {
       res.json(eventModel); 
    });

         
 }catch(error){
     res.json({error})
 }
   }
   )



app.get('/events', verifyToken, async (req,res)=> {

   try{

      let t=persianJs(req.body.date).arabicNumber().toString()
      let date=persianJs(t).persianNumber().toString(); // returns: 345

await eventModel.find({  $or:[{fromDate:date} ,{toDate:date}]})
   .populate("doctorId","profile_photo profile_name -_id") // key to populate
   .then(eventModel => {
      res.json(eventModel); 
   });
      
}catch(error){
    res.json({error})
}
  }
  )








module.exports = app;
