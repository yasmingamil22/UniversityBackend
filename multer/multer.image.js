const express = require('express')
const app= require('express').Router()

const multer  = require('multer')

function fileFilter (req, file, cb) {
  
if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'){
  cb(null, true)

}else{

  cb(null, false)
}
  
}


const upload = multer({
  
  storage:multer.memoryStorage(),

   fileFilter ,
limits:{
    fileSize:1024*1024*5
} })




module.exports = upload;


