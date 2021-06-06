
const { required, string } = require('@hapi/joi');
const mongoose =require('mongoose');

const userShema= new mongoose.Schema({
name : {
    type :String ,
    required :true ,
    min :3,
    max:250
},
prenom:{
   type : String,
},
password:{
    type : String ,
    required: true ,
    max:1024,
    min:6
},
email:{
    type :String,
    required : true ,
    max :50,
    min:12
},
apogee: {type: Number},
access:{
        type:String,
        required:true},
        
photo:String,
exam:[{type: mongoose.Schema.Types.ObjectId,
       ref:'exam'
    }],
 class:[{type: mongoose.Schema.Types.ObjectId,
        ref:'Class'
     }]
 
        
},{ collection: 'user' });
module.exports= mongoose.model('user',userShema);
