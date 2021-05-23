

const mongoose =require('mongoose');

const ReponcesShema= new mongoose.Schema({

user:{type: mongoose.Schema.Types.ObjectId,ref:'user'},

name:String,

date:{type:Date,default: Date.now},

reponces:[{

    content:{type:String,   required:true },

    choix:[String],
  
    number:{type:Number}
}],

exam:{type: mongoose.Schema.Types.ObjectId,ref:'exam'},

note:Number

},{ collection: 'reponces' })
module.exports= mongoose.model('reponces',ReponcesShema);