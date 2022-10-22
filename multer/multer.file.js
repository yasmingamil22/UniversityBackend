const express = require('express')
const app= require('express').Router()

const multer  = require('multer')

function fileFilter (req, file, cb) {
if(file.mimetype== 'application/pdf'||
file.mimetype=='application/vnd.openxmlformats-officedocument.presentationml.presentation'||
file.mimetype=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
  cb(null, true)

}else{

  cb(null, false)
}
  
}


const upload = multer({ 
  storage:multer.memoryStorage(),
  fileFilter,
limits:{
    fileSize:1024*1024*12
} })



module.exports = upload;


