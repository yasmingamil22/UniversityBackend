const express = require('express')

const app= require('express').Router()
const userModel=require('../model/user.model')
const doctorModel=require('../model/doctor.model')
const postModel=require('../model/post.model')
const lectureModel=require('../model/lecture.model')

const upload=require('../multer/multer.image')

const uploadFile=require('../services/firebase')

const {
    verifyTokenFromBody, 
    verifyTokenAndAuthorization,
 verifyToken
  } = require('../middleware/auth')
  

  
//get profile
app.get("/profile",verifyToken, async (req, res) => {
  console.log("10")
  let id=req.dataInToken.userId
    let user=await userModel.findOne({_id:id})
  let doctor=await doctorModel.findOne({_id:id})

    try {

        if(user){
    
      const user = await userModel.findById(id);
      res.status(200).json({user_name:user.user_name
        ,profile_name:user.profile_name,
        profile_photo:user.profile_photo,
        _id:user._id
        ,role:"Student"});
    }
      else if(doctor) {

        const doctor = await doctorModel.findById(id);
        res.status(200).json({
          user_name:doctor.user_name
        ,profile_name:doctor.profile_name,
        profile_photo:doctor.profile_photo,
        _id:doctor._id
          ,role:"Doctor"});
      }
    } catch (err) {

      res.status(500).json(err);
    }
  });


  //UPDATE profile_photo
app.put("/profile/:id/edit/photo",verifyTokenAndAuthorization,upload.single("file"),uploadFile, async (req, res) => {

    try {
      if(req.file==undefined){
        res.json({message:"undefined file"})
       }else{
    let id=req.params.id
    let user=await userModel.findOne({_id:id})
  let doctor=await doctorModel.findOne({_id:id})

  if(user){
    const newData = {
      profile_photo:req.file.firebaseUrl
  };
   result = await userModel.updateOne({ _id: req.params.id }, newData);
   
// upade profile image from old posts
  const p =await postModel.updateMany({ postedBy: id }, {profile_photo:newData.profile_photo});
 
  // upade profile image from old likes
const post = await postModel.find();

for (var i=0; i < post.length; i++) {
  let obj = post[i].likes.find((like, j) => {
    if (like.user_id==user._id) {
      post[i].likes[j] = {
       user_id:post[i].likes[j].user_id,
       profile_name:post[i].likes[j].profile_name,
         profile_photo:newData.profile_photo,
        _id:post[i].likes[j]._id
        };
        
    }
  })

  // upade profile image from old comments
 let obj2 = post[i].comments.find((comment, j) => {
      if (comment.user_id==user._id) {
        post[i].comments[j] = {
         user_id:post[i].comments[j].user_id,
         profile_name:post[i].comments[j].profile_name,
           profile_photo:newData.profile_photo,
          _id:post[i].comments[j]._id,
          caption:post[i].comments[j].caption,
          time:post[i].comments[j].time

          };
      }
    })
    const resl= post[i].save()
} 

  // upade profile image from old comments of lectures
const lectures = await lectureModel.find();

for (var i=0; i < lectures.length; i++) {
 
  let obj2 = lectures[i].comments.find((comment, j) => {
      if (comment.user_id==user._id) {
        lectures[i].comments[j] = {
         user_id:lectures[i].comments[j].user_id,
         profile_name:lectures[i].comments[j].profile_name,
           profile_photo:newData.profile_photo,
          _id:lectures[i].comments[j]._id,
          caption:lectures[i].comments[j].caption,
          time:post[i].comments[j].time

          };
      }
    })
    const resl= lectures[i].save()
} 



res.json({message:"done"});
}
else if(doctor) {

  const newData = {
    profile_photo:req.file.firebaseUrl
};

const result = await doctorModel.updateOne({ _id: req.params.id }, newData);

// upade profile image from old posts
const p =await postModel.updateMany({ postedBy: id }, {profile_photo:newData.profile_photo});

// upade profile image from old likes
const post = await postModel.find();
for (var i=0; i < post.length; i++) {
  let obj = post[i].likes.find((like, j) => {
    if (like.user_id==doctor._id) {
      post[i].likes[j] = {
       user_id:post[i].likes[j].user_id,
       profile_name:post[i].likes[j].profile_name,
         profile_photo:newData.profile_photo,
        _id:post[i].likes[j]._id
        };
    }
  })

 // upade profile image from old comments
  let obj2 = post[i].comments.find((comment, j) => {
    if (comment.user_id==doctor._id) {
      post[i].comments[j] = {
       user_id:post[i].comments[j].user_id,
       profile_name:post[i].comments[j].profile_name,
         profile_photo:newData.profile_photo,
        _id:post[i].comments[j]._id,
        caption:post[i].comments[j].caption,
        time:post[i].comments[j].time

        };
    }
  })

  const resl= post[i].save()
}

  // upade profile image from old comments of lectures

const lectures = await lectureModel.find();

for (var i=0; i < lectures.length; i++) {
 
  let obj2 = lectures[i].comments.find((comment, j) => {
      if (comment.user_id==doctor._id) {
        lectures[i].comments[j] = {
         user_id:lectures[i].comments[j].user_id,
         profile_name:lectures[i].comments[j].profile_name,
           profile_photo:newData.profile_photo,
          _id:lectures[i].comments[j]._id,
          caption:lectures[i].comments[j].caption,
          time:post[i].comments[j].time

          };
      }
    })
    const resl= lectures[i].save()
  }


res.json({message:"done"});

}
       }
    } catch (err) {
      console.log("Er")
      res.status(500).json({message:err});
    }
  
});

  //UPDATE profile_name
  app.put("/profile/:id/edit/name",verifyTokenAndAuthorization, async (req, res) => {
  
      try {
      let id=req.params.id
      let user=await userModel.findOne({_id:id})
    let doctor=await doctorModel.findOne({_id:id})
    if(user){
   
      const newData = {
        profile_name:req.body.profile_name
    };
  
    const result = await userModel.updateOne({ _id: req.params.id }, newData);
   
    // upade profile name from old posts
  const p =await postModel.updateMany({ postedBy: id }, {profile_name:newData.profile_name});

    // upade profile name from old likes
const post = await postModel.find();

for (var i=0; i < post.length; i++) {
  let obj = post[i].likes.find((like, j) => {
    if (like.user_id==user._id) {
      post[i].likes[j] = {
       user_id:post[i].likes[j].user_id,
       profile_name:newData.profile_name,
         profile_photo:post[i].likes[j].profile_photo,
        _id:post[i].likes[j]._id
        };
        
    }
  })

  // upade profile name from old comments
 let obj2 = post[i].comments.find((comment, j) => {
  
      if (comment.user_id==user._id) {
        console.log(i)
        console.log(j)
        post[i].comments[j] = {
         user_id:post[i].comments[j].user_id,
         profile_name:newData.profile_name,
          profile_photo:post[i].comments[j].profile_photo,
          _id:post[i].comments[j]._id,
          caption:post[i].comments[j].caption
          };
      }
    })
    const resl= post[i].save()
} 

// upade profile name from old comments of lectures

const lectures = await lectureModel.find();

for (var i=0; i < lectures.length; i++) {
 
  let obj2 = lectures[i].comments.find((comment, j) => {
      if (comment.user_id==user._id) {
        lectures[i].comments[j] = {
         user_id:lectures[i].comments[j].user_id,
         profile_name:newData.profile_name, 
           profile_photo:lectures[i].comments[j].profile_photo,
          _id:lectures[i].comments[j]._id,
          caption:lectures[i].comments[j].caption
          };
      }
    })
    const resl= lectures[i].save()
} 




    res.json({message:true});
  }
  else if(doctor) {
  
    const newData = {
      profile_name:req.body.profile_name
  };
  
  const result = await doctorModel.updateOne({ _id: req.params.id }, newData);

// upade profile name from old posts
const p =await postModel.updateMany({ postedBy: id }, {profile_name:newData.profile_name});

// upade profile name from old likes
const post = await postModel.find();
for (var i=0; i < post.length; i++) {
  let obj = post[i].likes.find((like, j) => {
    if (like.user_id==doctor._id) {
      post[i].likes[j] = {
       user_id:post[i].likes[j].user_id,
       profile_name:newData.profile_name,
         profile_photo:post[i].likes[j].profile_photo,
        _id:post[i].likes[j]._id
        };
    }
  })

 // upade profile image from old comments
  let obj2 = post[i].comments.find((comment, j) => {
    if (comment.user_id==doctor._id) {
      post[i].comments[j] = {
       user_id:post[i].comments[j].user_id,
       profile_name:newData.profile_name,
         profile_photo:post[i].comments[j].profile_photo,
        _id:post[i].comments[j]._id,
        caption:post[i].comments[j].caption
        };
    }
  })

  const resl= post[i].save()
}


// upade profile name from old comments of lectures

const lectures = await lectureModel.find();

for (var i=0; i < lectures.length; i++) {
 
  let obj2 = lectures[i].comments.find((comment, j) => {
      if (comment.user_id==doctor._id) {
        lectures[i].comments[j] = {
         user_id:lectures[i].comments[j].user_id,
         profile_name:newData.profile_name, 
           profile_photo:lectures[i].comments[j].profile_photo,
          _id:lectures[i].comments[j]._id,
          caption:lectures[i].comments[j].caption
          };
      }
    })
    const resl= lectures[i].save()
} 



res.json({message:true});
  
  }
  
      } catch (err) {
        res.status(500).json({message:err});
      }
  
    }
    
  );




  module.exports = app;


  /*

  async function updateUser(req, res) {
    if (req.user !== req.params.id) {
        return res.status(403).json({
            message: 'You cannot update other users profile'
        });
    }
    try {
        const user = await User.findOne({ _id: req.user });
        if (!user) {
            return res.status(404).json({
                message:
                    'The user record to be modified has not been found'
            });
        }
        const oldNickname = user.prof.n;
        const newData = {
            fn: req.body.firstName,
            ln: req.body.lastName,
            prof: {
                n: req.body.profile.nickname,
                p: req.body.profile.password,
                e: req.body.profile.email
            },
            i: req.body.interests,
            b: req.body.blocked
        };

        const result = await User.updateOne({ _id: req.params.id }, newData);
        if (!result) {
            return res.status(404).json({
                message: 'No records found'
            });
        }
        /**
         * Comprobar si hay que actualizar el nickname en las publicaciones,
         * comentarios y muros.
         
         if (oldNickname !== newData.prof.n) {
          const p = await Post.updateMany({ uid: req.user }, { n: newData.prof.n });
          const c = await Comm.updateMany({ uid: req.user }, { n: newData.prof.n });
          const w1 = await Wall.updateOne({ uid: req.user }, { n: newData.prof.n });
          const w2 = await Wall.updateMany({ "p.uid": mongoose.Types.ObjectId(req.user) }, { $set: { "p.$.n": newData.prof.n } });
          const w3 = await Wall.updateMany({ "p.c.uid": mongoose.Types.ObjectId(req.user) }, { $set: { "p.$.c.$[].n": newData.prof.n } });
      }

      res.json(result);
  } catch (err) {
      res.status(500).json({
          message: `There was an error updating the user: ${err.message}`
      });
  }
}




    /*
    const d =await postModel.updateMany({ $set: { likes:{ profile_photo:newData.profile_photo }

    }  });*/
    /*
    
     post[i].updateOne(  {
   // "likes._id" : post[i].likes[j]._id
   likes:{$elemMatch:{
    _id:post[i].likes[j]._id
   }
   }
    },      {
        $set: {
          "likes.$.profile_photo":newData.profile_photo
                }

      });
    */

/*
profile_photo:newData.profile_photo

      post[i].likes[j] = {
        user_id:post[i].likes[j].user_id,
        profile_name:post[i].likes[j].profile_name,
         profile_photo:newData.profile_photo,
         _id:post[i].likes[j]._id
        };
       const res=await post[i].likes[j].save()
        */
    /*  await post.updateOne({ $set: { likes:{ user_id: req.dataInToken.userId,
        profile_name:user.profile_name ,profile_photo:user.profile_photo }
      }  })*/
  



//let like = post.likes.find(like =>like.user_id==doctor._id);
/*
console.log(post.likes)
let obj = post.likes.find((like, i) => {
  if (like.user_id==doctor._id) {
    console.log(post.likes[i])
 
    post.likes[i] = {
      _id,
      profile_name,
      user_id,
       profile_photo:newData.profile_photo };
  /*  await post.updateOne({ $set: { likes:{ user_id: req.dataInToken.userId,
      profile_name:user.profile_name ,profile_photo:user.profile_photo }
    }  })
  }
}
); 

  const d =await postModel.updateMany({post.likes.find(like =>like.user_id==doctor._id)},
   {profile_photo:newData.profile_photo});*/



