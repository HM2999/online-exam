
const exam =require('../module/Exam')
const { model, isValidObjectId } = require("mongoose");
const user =require('../module/user')
const Class=require('../module/Class')
const router = require('express').Router();
const verify = require('./accessController/TokenValidator');
const {isAdmin, canEditeExam, cancreat} =require('./accessController/accessLevel');
const { date } = require('@hapi/joi');
const {ExamenValidation}=require('./accessController/validation')
const multer=require('multer');
const { eventNames } = require('../module/user');



 function makeid(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}
 let email=makeid(10);




 const storage =multer.diskStorage({
  destination:function(req,file,cb)
              {cb(null,'upload/');},
  filename:function(req, file , cb){
            cb(null,email+file.originalname);}
});

const fileFilter =(req,file,cb)=>{
  if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'||file.mimetype==='image/jpg'){cb(null,true)}
else {cb('err',false)}

}


const upload =multer({storage:storage ,limits:{
  fileSize:1024*1024*10
},fileFilter})






//get all exams 
router.get('/',verify,async (req,res)=>{

  try {
    if(req.body.access!='admin') return res.json('you cant get the exam')
    const allexam =await exam.find()
    res.json(allexam)
  } catch (error) {
    res.json(err)
  }
})




  //get exam 
  router.get('/spe', verify,async (req, res) => {
try {


  const examk =await exam.findOne({"_id":req.body.id})
  const user1 = await user.findOne({"_id":req.body.userid})
  if(user1.exam.includes(examk._id)) return res.json("you dont have  the access to the exam")

//you shoould be find how to count the date for testing 

  if(new Date(examk.date)>new Date()) return res.send(`this content valide after${examk.date}`)

  Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
  if(new Date(examk.date)<new Date().addHours(1)) return res.send(`the time of the exam has been passed ${new Date(examk.date)}`)
  
 
    res.send(examk)
  
} catch (err) {
  res.json(err)
}
})
 
//creat exam 
router.post('/',upload.array('Img',20),verify,async (req,res)=>{

  if(req.body.access!="admin") return res.json("access denai")
  const {error}=ExamenValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  
const R=req.body


var paths = req.files.map(file => file.path)
console.log(paths)
console.log(req.files)

let i=0
arr=[]
R.Question.forEach(element => {
  if(element.src){
  arr.push({number:element.number,content:element.content,option:element.option,correction:element.correction,src:paths[i],barem:element.barem})
  i++;
}else{
  arr.push({number:element.number,content:element.content,option:element.option,correction:element.correction,src:null,barem:element.barem})
}
  
  return arr
})


const Exam= new exam({

  prof:R.prof,
  class:R.class,
  module:R.module,
  date:R.date,
  Question:arr,
 
})

  try{  
  const savedExam= await Exam.save()
  res.json(savedExam);
  } 
  catch(err){
  
      res.status(400).send(err);
  }
  });
  //add calss to exam
router.put('/',verify,async (req,res)=>{
try {
  if(req.body.access!="admin") return res.json("access denai")
  const clas= await Class.findOne({"semester":req.body.semester})

  id=clas._id

 const examupdate= await exam.updateOne({"_id":req.body._id,"class":{$ne:id}},{$push:{"class":id}},{multi:true})



const resultas= await exam.findOne({"_id":req.body._id})
.populate('class',"semester")
.exec()


res.json(resultas)

  } catch (error) {
    res.status(400).json(error)
  }


})

  //update exam

  router.patch('/question',verify,async (req,res)=>{
    
 try { 
  if(req.body.access!="admin") return res.json("access denai")

  const examupdate=await exam.updateOne({"Question._id":req.body.idq},{"$set":{"Question.$":{content:req.body.content,option:req.body.option,correction:req.body.correction,number:req.body.number,_id:req.body.idq}
  }})

   res.send(examupdate)

 } catch (err) {
   res.json(err)
 }
  })


  //update date 
  
  router.patch('/date',verify,isAdmin,async (req,res)=>{
   
 try {
   if(req.body.access!="admin") return res.json("access denai")


  const examupdate= await exam.findByIdAndUpdate({"_id":req.body._id},{

    $set:{
     "date":req.body.date
         }
      })
   res.send(examupdate)

 } catch (err) {
   res.json(err)
 }
  })
  
  //remove exam
  router.delete('/',verify,isAdmin,async (req,res)=>{

    try {
      if(req.body.access!="admin") return res.json("access denai")
      const examl= await exam.deleteOne({"_id":req.body._id})
      res.json('the exam was removed from db') 
    } catch (err) {
      res.json(err)
    }
  }) 
  
  module.exports = router