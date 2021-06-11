

const mongoose =require('mongoose');

const notSchema = new mongoose.Schema({



    semester:String,

    module:String,
  
    note:Number,
    
    etudient:{type: mongoose.Schema.Types.ObjectId,ref:'user'}

   
},{ collection: 'note' })
module.exports= mongoose.model('Notes',notSchema);