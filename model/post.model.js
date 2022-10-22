const mongoose = require ('mongoose');

const postSchema = mongoose.Schema({
    postedBy: { type: String  },
    profile_name:{type: String,default:''},
    profile_photo:{type: String,default:''},
    caption:{type:String,trim:true,default:''},
    image:{type:String,default:''},
    vidoe:{type:String,default:''},
    createdAt: {
        type: String,
        default: Date.now
      },
    likes: [
        {
            user_id: String,
            profile_name:{type: String,default:''},
            profile_photo:{type: String,default:''} ,
        }
    ] ,
    likesNum:{type: Number,default:0},
    comments:[
        {
            user_id: String,
            profile_name:{type: String,default:''},
            profile_photo:{type: String,default:''},
            caption:String,
	        time:{
                type: String,
                default: Date.now
              }
        }
    ],
})
const postModel=mongoose.model('post',postSchema)

module.exports = postModel


/*
//typeOfData = mongoose.Schema.Types.String;
//typeOfAuthor = mongoose.Schema.Types.ObjectId;

    lecturers: {type: [{type: String, required: true}], required: true},


comments:[
        {
            author:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
            data:{type:mongoose.Schema.Types.String}
        }

    ]*/
