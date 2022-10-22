const app= require('express').Router()
const doctorModel=require('../model/doctor.model')
const bcrypt = require('bcrypt');



app.post('/addDoctor',  (req,res)=> {
   const {user_name,user_code,subject_name}=req.body

bcrypt.hash(user_code, 7, async function(err, hash) {


try{
        await doctorModel.insertMany({ user_name,user_code:hash ,subject_name})
} catch(error){

    res.json({error})
}

})
     res.send({message:"done"})

  }
  )


  module.exports = app;
