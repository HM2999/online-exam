const Reponces = require('../module/Reponces')
const user =require('../module/user')
const { request } = require('express');
const  express = require('express');
const router = express.Router();
const {repancesValidation}=require('./accessController/validation')
const verify = require('./accessController/TokenValidator');
const exam=require('../module/Exam')
const Note=require('../module/note');
const note = require('../module/note');


router.post('/',verify,async (req,res)=>{
    const {error}=repancesValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
const R=req.body
arr=[]
corr=[]
let i=0,notexam=0
const allredyexist= await Reponces.find({"user":R.userid,"exam":R.examid})
console.log(allredyexist)
if(allredyexist) return res.json("allredy send")
const exam1=await exam.findOne({"_id":req.body.examid})



exam1.Question.forEach(element=>{corr.push({correction:element.correction,barem:element.barem})})



R.reponces.forEach(element => {
    arr.push({number:element.number,content:element.content,choix:element.choix})
    if(element.choix.toString()==corr[i].correction.toString()){notexam+=corr[i].barem}
  
   i++
   return arr;
   })

 const responce= new Reponces({

    user:R.user,
    exam: R.examid,
    name:R.name,
    reponces:arr,
    note:notexam
   
})

const note=new Note({
 module:R.module,
 note:notexam,
 semester:R.semester,
etudient:R.userid

})
    try{  
      await note.save()
    const savedRepances= await responce.save()
    res.json("your reponces send succefully");
    } 
    catch(err){
    
        res.status(400).send(err);
    }
    });
//get note 

router.get('/',verify,async (req,res)=>{

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

// router.get('/detail',verify,async (req,res)=>{
//   try {
//     const a=req.body.user

//     const notes= await Reponces.find({user:a})
//     .populate("exam","module")
//     .exec()
//     res.send(notes)

//   } catch (err) {
//       res.send(err)
//   }


// })

module.exports=router;