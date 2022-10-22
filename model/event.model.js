const mongoose = require ('mongoose');


const eventSchema = mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    event_name:{type:String},
    fromDate:String,
    fromTime:String,
    toDate:String,
    toTime:String,
    subject_name:{type:String},
    
})
const eventModel=mongoose.model('event',eventSchema)


module.exports = eventModel

