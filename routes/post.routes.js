const express = require('express')

const app= require('express').Router()
const postModel=require('../model/post.model')
const mongoose = require("mongoose");
const userModel=require('../model/user.model')
const doctorModel=require('../model/doctor.model')

const upload=require('../multer/multer.image')

const uploadFile=require('../services/firebase')


const {
  verifyTokenFromBody, 
  verifyTokenAndAuthorization,
  verifyToken
} = require('../middleware/auth')


  //create a post with images
//upload.single("file") upload.array("files",4)

app.post("/addPost",verifyToken, upload.single("file"), uploadFile , async (req, res) => {
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
  try {

  let user=await userModel.findOne({_id:req.dataInToken.userId})
  let doctor=await doctorModel.findOne({_id:req.dataInToken.userId})
  
  if(req.file==undefined){
    if(user){
      const newPost = new postModel({
        postedBy:req.dataInToken.userId,
        profile_name:user.profile_name,
        profile_photo:user.profile_photo,
        caption:req.body.caption,
        createdAt:formatted
              } );

        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
}
  else if(doctor) {

    const newPost = new postModel({
      postedBy:req.dataInToken.userId,
      profile_name:doctor.profile_name,
      profile_photo:doctor.profile_photo,
      caption:req.body.caption,
      createdAt:formatted
    } );

      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
  }
  }else{

    if(user){
      const newPost = new postModel({
        postedBy:req.dataInToken.userId,
        profile_name:user.profile_name,
        profile_photo:user.profile_photo,
        caption:req.body.caption,
        image:req.file.firebaseUrl,
        createdAt:formatted
              } );

        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

}
  else if(doctor) {

    const newPost = new postModel({
      postedBy:req.dataInToken.userId,
      profile_name:doctor.profile_name,
      profile_photo:doctor.profile_photo,
      caption:req.body.caption,
      image:req.file.firebaseUrl,
      createdAt:formatted
    } );

      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
  }
}
} catch (err) {

  res.status(500).json(err);
} 
  });


  //update a post
  app.put("/post/:id/edit",verifyTokenFromBody, async (req, res) => {
    
  try {

    const post = await postModel.findById(req.params.id);

   if (post.postedBy === req.dataInToken.userId) {

      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }

  } catch (err) {
    res.status(500).json(err);
  }
});


//delete a post

app.delete("/post/:id/delete",verifyToken, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.postedBy === req.dataInToken.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a post
app.put("/post/:id/like",verifyToken, async (req, res) => {
  let user=await userModel.findOne({_id:req.dataInToken.userId})
  let doctor=await doctorModel.findOne({_id:req.dataInToken.userId})
 
  try {
    const post = await postModel.findById(req.params.id);

    if (!post.likes.find(like=>like.user_id==req.dataInToken.userId)) {

      if(user){
        await post.updateOne({ $push: { likes:{ 
          user_id: req.dataInToken.userId,
          profile_name:user.profile_name ,
          profile_photo:user.profile_photo }
        }  });
    

        likesN=post.likesNum+1
        await post.updateOne({likesNum:likesN});
      }else if(doctor){

        await post.updateOne({ $push: { likes:{user_id: req.dataInToken.userId ,
          profile_name:doctor.profile_name ,profile_photo:doctor.profile_photo}
        }  });
        likesN=post.likesNum+1
        await post.updateOne({likesNum:likesN});  
      } 
      const post1 = await postModel.findById(req.params.id);
      res.status(200).json({message :"The post has been liked" , 
      likes:post1.likes ,
      likesNum:post1.likes.length});
    } else {
    let data= post.likes.find(like=>like.user_id==req.dataInToken.userId)

      await post.updateOne({ $pull: { likes: data } });
        likesN=post.likesNum-1
      await post.updateOne({likesNum:likesN});
      const post2 = await postModel.findById(req.params.id);
      res.status(200).json({message :"The post has been disliked" , 
      likes:post2.likes ,
      likesNum:post2.likes.length});

    }
  } catch (err) {

    res.status(500).json(err);
  }
});

//add comment
app.post("/post/:id/comment",verifyTokenFromBody, async (req, res) => {
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
  console.log(formatted)

  let user=await userModel.findOne({_id:req.dataInToken.userId})
  let doctor=await doctorModel.findOne({_id:req.dataInToken.userId})

  try {
    const post = await postModel.findById(req.params.id);
   
      if(user){
        await post.updateOne({ $push: { comments:{ 
          user_id: req.dataInToken.userId,
          profile_name:user.profile_name ,
          profile_photo:user.profile_photo ,
          caption:req.body.caption ,
          time:formatted
        }
        }  });
       
      }else if(doctor){

        await post.updateOne({ $push: { comments:{user_id: req.dataInToken.userId ,
          profile_name:doctor.profile_name ,profile_photo:doctor.profile_photo ,
          caption:req.body.caption ,
          time:formatted
        }
        }  });
      }        
    const Npost = await postModel.findById(req.params.id);
    res.json(Npost.comments)

  } catch (err) {
    res.status(500).json(err);
  }
})


//get a post

app.get("/post/:id",verifyToken, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

///to get all posts
app.get("/home", verifyToken, async (req, res) => {
 
  try {
    const post = await postModel.find().sort({ createdAt: -1 }) //.limit(1);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }

})


  module.exports = app;


  /*
  //create a post
/*
app.post("/addPost",verifyTokenFromBody, async (req, res) => {
  let user=await userModel.findOne({_id:req.dataInToken.userId})
  let doctor=await doctorModel.findOne({_id:req.dataInToken.userId})
  try {

    if(user){

      const newPost = new postModel({
        postedBy:req.dataInToken.userId,
        profile_name:user.profile_name,
        profile_photo:user.profile_photo,
        caption:req.body.caption
       } );
      
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

}
  else if(doctor) {
    const newPost = new postModel({
      postedBy:req.dataInToken.userId,
      profile_name:doctor.profile_name,
      profile_photo:doctor.profile_photo,
      caption:req.body.caption
     } );
     console.log(  doctor.profile_photo)
      const savedPost = await newPost.save();
     

      res.status(200).json(savedPost);

  }
} catch (err) {

  res.status(500).json(err);
}

  });*/