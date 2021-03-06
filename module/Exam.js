
const { string, number } = require('@hapi/joi');
const mongoose =require('mongoose');

const ExamSchema = new mongoose.Schema({
module:{type : String},
class:[
    {type: mongoose.Schema.Types.ObjectId,
    ref:'Class'
    }
],
prof:{type: mongoose.Schema.Types.ObjectId,
    ref:'user'
    },
date:String,

 Question:[{

content:{      
type:String,
required:true
}, 

 number:{
type:Number,
required:true
},

src:String,

option:[String],
correction:[String]
,barem:{type:Number,required:true}     
 }],   
},{ collection: 'exam' })
module.exports= mongoose.model('exam',ExamSchema);