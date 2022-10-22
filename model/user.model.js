const mongoose =require("mongoose")

const userSchema=mongoose.Schema({
    user_name:{type:String,required:true,unique:true},
    user_code:{type:String,required:true} ,
    profile_name:{type:String,default:''},
    profile_photo:{type:String,default:''},
})

const userModel=mongoose.model('user',userSchema)


module.exports=userModel


/*
role: {
      type: String,
      enum: ["user", "lecturer"],
      default: "user"
    }

    */