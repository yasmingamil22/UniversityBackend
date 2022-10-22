const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const jwt = require('jsonwebtoken')
const helmet = require("helmet");
const auth = require('./middleware/auth')



const userModel = require('./model/user.model')
const doctorModel = require('./model/doctor.model')
const lectureModel = require('./model/lecture.model')
const subjectModel = require('./model/subject.model')

const { json } = require('body-parser')

app.use(helmet());
app.use(express.json())
app.use(cors())


const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://yasmingamil:2041999yasmin@cluster0.3470s.mongodb.net/ProjectDB").then((resualt) => {
  app.listen(process.env.PORT  || 4000, () => {
    console.log("Example app listening at http://localhost:4000");
  });

 console.log('Successfully connected to the database');
})
  .catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
  })


  app.use(require('./routes/login.routes'))
  app.use(require('./routes/user'))
  app.use(require('./routes/doctor'))
  
  app.use(require('./routes/post.routes'))
  
  app.use(require('./routes/subject.routes'))
  app.use(require('./routes/lecture.routes'))
  app.use(require('./routes/event.routes'))

 


app.listen(port, () => { console.log("app here list") })


app.use(express.json())

app.use(require('./routes/profile.routes'))


//app.use(require('./multer'))

//app.use(require('./multer.single'))

//app.use(require('./test'))
//app.use(require('./multer'))



const {
  verifyTokenFromBody, 
  verifyTokenAndAuthorization,
verifyToken
} = require('./middleware/auth')

const upload=require('./multer/multer.image')

const uploadFile=require('./services/firebase')
app.post('/test', verifyToken,upload.single("file"),uploadFile, (req, res) => {
  if(req.file==undefined){
    res.json({url:"undefined file"})
   }else{
    res.json({url:req.file.firebaseUrl})

   }

  }
  )



/*


app.post('/addNote', auth, async (req, res) => {
  const { tittle, des } = req.body

  try {
    //req.userId  دا اد اللي جاي من التوكن اقدر ادخله جوا ال insert
    //    await noteModel.insertMany({ userId:req.userId, tittle, des })
    await noteModel.insertMany({ tittle, des })
    res.json({ message: "done" })

  } catch (error) {
    res.json({ error })
  }

})


app.post('/addPost', async (req, res) => {
  await postModel.insertMany({
    userId: req.body.userId,
    caption: req.body.caption
  })
  res.send("done")
}
)

///to get all posts
app.get('/home', async (req, res) => {
  let userId = req.header('userId')
  let token = req.header('token')

  jwt.verify(token, 'key', async (err, decoded) => {
    if (err) {
      res.json({ err })
    } else {
      let posts = await postModel.find()
      res.json({ posts })
    }
  })



})

app.post('/profile', function(req, res) {
		var userAuth = req.body;
		console.log('====== debug ======');
		console.log(userAuth);
		console.log('====== debug ======');
		User.findOne({'authen.site': userAuth.site, 'authen.id': userAuth.id}, function(err, user) {
			if (err) {
				console.log('err');
				res.send('go_error');
				throw err;
			}
			if (!user) {
				res.send('go_regis');
			}
			else {
				res.json(user);
			}
		});
	});

  */



