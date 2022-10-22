const mongoose = require ('mongoose');


const subjectSchema = mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    subject_name:{type:String, required:true},
    lectures:[
        { type: mongoose.Schema.Types.ObjectId, ref: 'lecture' }
      ]
})
const subjectModel=mongoose.model('subject',subjectSchema)


module.exports = subjectModel

