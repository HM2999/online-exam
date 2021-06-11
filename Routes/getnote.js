
const  express = require('express');
const router = express.Router();
const {repancesValidation}=require('./accessController/validation')
const verify = require('./accessController/TokenValidator');

const note = require('../module/note');

router.get('/',verify,async (req,res)=>{

    try {
        const a=req.body.userid
        const arr=[]
    
        const notes= await note.find({user:a})
        .populate("user","name prenom")
        .exec()
      

    res.send(notes)
    
    } catch (err) {
        res.send(err)
    }
    
    
    })
    module.exports=router;