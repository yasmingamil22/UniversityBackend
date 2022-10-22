const mongoose =require("mongoose")

const doctorSchema=mongoose.Schema({
    user_name:{type:String,required:true,unique:true},
    user_code:{type:String,required:true} ,
    subject_name:[String] ,
    profile_name:{String,default:''},
    profile_photo:{String,default:''}
})

const doctorModel=mongoose.model('doctor',doctorSchema)

module.exports=doctorModel
