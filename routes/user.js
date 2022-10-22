const app= require('express').Router()
const userModel=require('../model/user.model')
const bcrypt = require('bcrypt');



app.post('/addUser',  (req,res)=> {
   const {user_name,user_code}=req.body

bcrypt.hash(user_code, 7, async function(err, hash) {

try{
        await userModel.insertMany({ user_name,user_code:hash })
}catch(error){
    res.json({error})
}
})
     res.send({message:"done"})

  }
  )


  module.exports = app;

  /*
  app.post("/addUser", async (req, res) => {
   const newUser = new userModel(req.body);
   bcrypt.hash(newUser., 7, async function(err, hash) {

      try{
              await userModel.insertMany({ user_name,user_code:hash })
      
      }catch(error){
      
          res.json({error})
      }
      
      })
           res.send({message:"done"})

   try {
     const savedUser = await newUser.save();
     res.status(200).json(savedUser);
   } catch (err) {
     res.status(500).json(err);
   }
 });

 */
