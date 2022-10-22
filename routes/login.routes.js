const app= require('express').Router()
const userModel=require('../model/user.model')
const doctorModel=require('../model/doctor.model')

const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')


app.post('/login', async (req,res)=> {
  const{user_name,user_code}=req.body
  
  let user=await userModel.findOne({user_name})
  
  let doctor=await doctorModel.findOne({user_name})
  if(user){
    const match = await bcrypt.compare(user_code, user.user_code);
   if(match){
    
     let token=  jwt.sign({userId:user._id,role:"user"},'key')
       res.json({token:token,isSuccessful:true ,massage:"Login Successful"
       ,role:"user" })
   }else{
    res.json({isSuccessful:false,massage:"password incorrect"})

   }

  }else if(doctor){
    const match = await bcrypt.compare(user_code, doctor.user_code);

    if(match){
      let token=  jwt.sign({userId:doctor._id,role:"doctor"},'key')
        res.json({token:token,isSuccessful:true ,massage:"Login Successful"
        ,role:"doctor"})
    }else{
     res.json({isSuccessful:false,massage:"password incorrect"})
 
    }

  }else{
    res.json({isSuccessful:false,massage:"user_name doesnt exist"})

  }
  }
  )

  module.exports = app;
