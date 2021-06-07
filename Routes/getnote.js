
const  express = require('express');
const router = express.Router();
const {repancesValidation}=require('./accessController/validation')
const verify = require('./accessController/TokenValidator');

const note = require('../module/note');

outer.get('/',verify,async (req,res)=>{

    try {
        const a=req.body.userid
        const arr=[]
    
        const notes= await note.find({user:a})
        .populate("user","name prenom")
        .exec()
      
    // for(let i =0;i<notes.length;i++){
    //     arr.push({module:notes[i].module,note:notes[i].note})
    // }
       
    // var output = [];
    
    // arr.forEach(function(item) {
    //   var existing = output.filter(function(v, i) {
    //     return v.module == item.module;
    //   });
    //   if (existing.length) {
    //     var existingIndex = output.indexOf(existing[0]);
    //     output[existingIndex].note = output[existingIndex].note.concat(item.note);
    //   } else {
      
    //     item.note = [item.note];
    //     output.push(item);
    //   }
    // })
    
    // output.forEach(element=>{
    
    //    element.note=element.note.reduce(function(acc, val) { return acc + val; }, 0)/element.note.length
    // })
    res.send(notes)
    
    } catch (err) {
        res.send(err)
    }
    
    
    })