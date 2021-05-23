
const { string } = require('@hapi/joi');
const mongoose =require('mongoose');

const ClassSchema = new mongoose.Schema({
name:String,
etudient:[{type: mongoose.Schema.Types.ObjectId,
    ref:'user'}]
   
},{ collection: 'Class' })
module.exports= mongoose.model('Class',ClassSchema);