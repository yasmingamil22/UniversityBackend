const mongoose = require ('mongoose');

const lectureSchema = mongoose.Schema({
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'doctor' 
      },
    subject: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'subject' 
      },
    file:{type:String,default:''},
    fileName:{type:String,default:''},
   
    createdAt: {
        type: String,
        default: Date.now
      },
    
      comments:[
        {
            user_id: String,
            profile_name:{type: String,default:''},
            profile_photo:{type: String,default:''},
            caption:String,
	        time:{
                type: String,
                default: Date.now
              }
        }
    ],
})
const lectureModel=mongoose.model('lecture',lectureSchema)


module.exports = lectureModel

