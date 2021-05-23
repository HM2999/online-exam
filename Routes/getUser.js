const { model } = require("mongoose");
const user =require('../module/user')
const class1 =require('../module/Class')
const router = require('express').Router();
const verify = require('./accessController/TokenValidator');
const access =require('./accessController/accessLevel');
const Class = require("../module/Class");
const { collection } = require("../module/user");


//get all the user     
  router.get("/",verify,async (req,res)=>{
    try{
      if(req.body.access!="admin") return res.send('access denai')
    const Users= await user.find()
    .populate('class',"name")
    .exec()
  
  Users.forEach(element => {element.password=null})
    res.json(Users);
    
    }catch(err)
    {
        res.json({message:err})}    
    });

    //get sepicifique user

    router.get("/sep",verify,async (req,res)=>{
      try{
        if(req.body.access!="admin") return res.send('access denai')
      const Users= await user.find({"_id":req.body.id})
      .populate('class',"name")
      .exec()
   
      Users[0].password=''
      res.json(Users);
      
      }catch(err)
      {
          res.json({message:err})}    
      });

//add user to a class      
  router.patch("/",verify,async(req,res)=>{
    try{
      const  data=[]
      const arr =req.body.id
  console.log(arr)
      for(i=0;i<arr.length;i++)
  {
    let id =arr[i]
    data[i] = await class1.updateOne({"name":req.body.class,"etudient":{$ne :id} },{$push:{"etudient":id}},{ multi: true})
    console.log(data[i])
  }


  const data1 = await class1.find({"name":req.body.class})

  let idC =data1[0]._id

  const arr1 =data1[0].etudient;


  arr1.forEach(async (element)=>{
  let add= await user.updateOne({"_id":element,"class":{$ne :idC}},{$push :{"class":idC}},{multi:true})
  })
   
  res.json(data)
    
    }catch(err)
    {
        res.json({message:err})}    
    });
    //delete from calss

 router.delete("/",verify,async (req,res)=>{
  try{
    
    let id =req.body.id
    const data = await class1.updateOne({"name":req.body.class}
    ,{$pull:{"etudient":{$in :[id]}}}
    ,{ multi: true})
  
    res.json(data)
      
      }catch(err)
      {
          res.json({message:err})}    
      });
      
//creat new class 
router.post('/new',verify,async (req,res)=>{

try{
  if(req.body.access=="etudient") return res.json('you cant add class')
 const clas = new Class({
   name:req.body.name,
   etudient:req.body.etudient
  })

 const savedClass=  await clas.save()
 
res.send(savedClass)

}catch(err){
  res.json(err)
}
})
//get class
router.get('/class',verify,async(req,res)=>{
try{const clas= await class1.find({"name":req.body.name}).populate('etudient','name').exec()
res.json(clas)}catch(err){res.json(err)}

})
//get all class
router.get('/allclass',verify,async (req,res)=>{

    try {
      const all= await class1.find()
      .populate('etudient',"name prenom")
      .exec()
 
  
     res.send(all)
    } catch (error) {
      res.send(error)
    }

  
  })
  
module.exports=router;