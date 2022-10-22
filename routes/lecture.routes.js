const app= require('express').Router()
const lectureModel=require('../model/lecture.model')
const doctorModel=require('../model/doctor.model')
const subjectModel=require('../model/subject.model')
const userModel=require('../model/user.model')

//const firebase = require('firebase'); // eslint-disable-line global-require

/*
const multer  = require('multer')
const Multer=multer({
  storage:multer.memoryStorage(),
  limits:1024*1024*5
})
*/
const uploadFile=require('../services/firebase')

const upload=require('../multer/multer.file')


const {
    verifyTokenFromBody, 
    verifyTokenAndAuthorization,
    verifyTokenAndDoctor,
    verifyToken
  } = require('../middleware/auth')


app.post('/subject/:id/addLecture',verifyTokenAndDoctor, upload.single("file"),uploadFile, async (req,res)=> {

  try{

  const subject = await subjectModel.findById(req.params.id)

  if(req.dataInToken.userId==subject.doctorId){
   
       lecture={
        doctorId:req.dataInToken.userId,
        file: req.file.firebaseUrl,
        fileName:req.file.originalname,
        subject:req.params.id
    }
   const newLecture=await lectureModel.create(lecture)

 await subjectModel.updateOne({ $push: { lectures:newLecture._id 
}  });
 res.json({message:"done"}) 

  }else{
    res.status(403).json({message :"You are not alowed to do that!"});
  }

}catch(error){

    res.json({error})
}

  }
  )


  app.post('/lecture/:id/addComment',verifyToken, async (req,res)=> {
    if(!req.body.caption){
      res.json({message:"you must add caption"})
    }else{

    process.env.TZ = "Africa/Cairo";
  var date = new Date();
  
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes.toString().padStart(2, '0');
  let formatted =year + "-" + month + "-" + day + " " + hours + ':' + minutes + ' ' + ampm;

    let user=await userModel.findOne({_id:req.dataInToken.userId})
  let doctor=await doctorModel.findOne({_id:req.dataInToken.userId})
    try{
      const lecture = await lectureModel.findById(req.params.id)
      if(user){
        await lecture.updateOne({ $push: { comments:{ user_id: req.dataInToken.userId,
          profile_name:user.profile_name ,profile_photo:user.profile_photo ,
          caption:req.body.caption ,
          time:formatted
        }
        }  });

      }else if(doctor){

        await lecture.updateOne({ $push: { comments:{user_id: req.dataInToken.userId ,
          profile_name:doctor.profile_name ,profile_photo:doctor.profile_photo ,
          caption:req.body.caption,
          time:formatted
        }
        }  });
     
     
      }
           res.status(200).json({message:"post has been commented"});
    }catch(error){
        res.json({message:error})
    }
      }}
      )


      app.get('/lecture/:id/allComments',verifyToken, async (req,res)=> {
      
        try{
          
          const lecture = await lectureModel.findById(req.params.id)
       
            res.json(lecture.comments)
        
        }catch(error){
        
            res.json({error})
        }
        
          }
          )


 


  module.exports = app;

  /*

  export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};
*/