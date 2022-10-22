
/*

var admin = require("firebase-admin");

//var serviceAccount = require("../config/firebase-key.json");
var serviceAccount = require("../config/firebase-k.json");

//const BUCKET="nodejs-college.appspot.com"
const BUCKET="my-project-41215.appspot.com"


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:BUCKET
});

const bucket =admin.storage().bucket();

const uploadFile=(req,res,next)=>{
    console.log("2")

    if(!req.file) return next()
    const file=req.file;
    const fileName=Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' +
    file.originalname
    const fileB =bucket.file(fileName)

    //const storeRef=firebase.storage().ref('images/'+fileName)
    //storeRef.put(file)

    const stream =fileB.createWriteStream({
        metadata:{
            contentType:file.mimetype,
        }
    })
    stream.on("error",(e)=>{
        console.log(e)
    })

    stream.on("finish",async()=>{
           next()
    console.log("3333")

        await fileB.makePublic()
        req.file.firebaseUrl='https://storage-googleapis.com/'+BUCKET+'/'+fileName
        console.log("44444")

     })

    stream.end(file.buffer)
}
*/


var admin = require("firebase-admin");

var serviceAccount = require("../config/firebaseKey.json");
const BUCKET="nodejs-college-project.appspot.com"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:BUCKET ,
});


const bucket =admin.storage().bucket();


const uploadFile=(req,res,next)=>{
    if(!req.file) return next()

    const imagem=req.file;
    const fileName=Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' +
    imagem.originalname
    
    const file =bucket.file(fileName)
   

    const stream =file.createWriteStream({
        metadata:{
            contentType:imagem.mimetype,
        }
    })
    stream.on("error",(e)=>{
        console.error(e)
    })

    stream.on("finish", async()=>{

        await file.makePublic()

        req.file.firebaseUrl=`https://storage.googleapis.com/${BUCKET}/${fileName}`

        next()
    })

    stream.end(imagem.buffer)


}



//`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`









module.exports=uploadFile



//https://storage-googleapis.com
//https://firebasestorage.googleapis.com