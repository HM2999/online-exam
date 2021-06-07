

const mongoose =require('mongoose');

const ClassSchema = new mongoose.Schema({
semester:String,
etudient:[{type: mongoose.Schema.Types.ObjectId,
    ref:'user'}],
    modules:[{type:mongoose.Schema.Types.String}] 
   
},{ collection: 'Class' })
module.exports= mongoose.model('Class',ClassSchema);