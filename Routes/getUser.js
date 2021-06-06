const { model } = require("mongoose");
const user =require('../module/user')
const class1 =require('../module/Class')
const router = require('express').Router();
const verify = require('./accessController/TokenValidator');
const access =require('./accessController/accessLevel');
const Class = require("../module/Class");
const { collection } = require("../module/user");
const multer=require('multer')



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


// Requiring the module
const reader = require('xlsx');


const storage =multer.diskStorage({
  destination:function(req,file,cb)
              {cb(null,'xlsxFiles/');},
  filename:function(req, file , cb){
            cb(null,email+file.originalname);}
});

const fileFilter =(req,file,cb)=>{
  if(file.mimetype==='application/vnd.ms-excel'||file.mimetype==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){cb(null,true)}
else {cb('err',false)}

}


const upload =multer({storage:storage ,limits:{
  fileSize:1024*1024*15
},fileFilter})

//get all the user     
  router.get("/",verify,async (req,res)=>{                 // pages=nomber>0
    try{
      if(req.body.pages<1) return res.send('bad value of the pages')

let Skip=(req.body.pages-1)*20

      if(req.body.access!="admin") return res.send('access denai')  //access=admin
      const admin= await user.findById({'_id':req.body._id});       
    if(admin.access!="admin") return res.json('access denai you dont have the right access');

      const Count= await user.countDocuments();
    const Users= await user.find().skip(Skip).limit(20)
    .populate('class',"name")
    .exec()
  
  Users.forEach(element => {element.password=null})
  Users.push(Count/20)
    res.json(Users);

    
    }catch(err)
    {
        res.json({message:err})}    
    });

    //get sepicifique user

    router.get("/sep",verify,async (req,res)=>{
      try{
        if(req.body.access!="admin") return res.send('access denai');
        const admin= await user.findById({'_id':req.body._id});       
        if(admin.access!="admin") return res.json('access denai you dont have the right access');

  
      const Users= await user.find({"apogee":req.body.apogee})
      .populate('class',"semester")
      .exec()
   
      Users[0].password='';
      Users.password=''
      res.json(Users);
      
      }catch(err)
      {
          res.json({message:err})}    
      });
//get prof


router.get("/prof",verify,async (req,res)=>{
  try{
    if(req.body.access!="admin") return res.send('access denai')             //   access=admin
    const admin= await user.findById({'_id':req.body._id});                  //_id =_id
    if(admin.access!="admin") return res.json('you cant get the exam');

  const Users= await user.find({"access":"prof"})
  .populate('class',"semester")
  .exec()

  Users[0].password='';
  Users.password=''
  res.json(Users);
  
  }catch(err)
  {
      res.json({message:err})}    
  });




//add users/user to a class      
  router.patch("/",verify,upload.single('Img'),async(req,res)=>{
    try{
    console.log(req.file.filename)
    const q='./xlsxFiles/'+req.file.filename;
      const file = reader.readFile(q)

      let data = []
      
      const sheets = file.SheetNames
      
      for(let i = 0; i < sheets.length; i++)
      {
      const temp = reader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]])
      temp.forEach((res) => {
        data.push(res)
      })
      }
      console.log(data)


  

   let data0=[];
   let arr1=[];

      data.forEach(async element => {

      
          data0 = await class1.updateOne({"semester":element.className,"etudient":{$ne :element.id} },{$push:{"etudient":element.id}},{ multi: true})
     
          const    data1 = await class1.find({"semester":element.className});
          // console.log(data1)
       
         let add= await user.updateOne({"_id":element.id,"class":{$ne :data1[0]._id}},{$push :{"class":data1[0]._id}},{multi:true})
         
         arr1.push(add)
       
      })
 
       res.json("success")
    
      }catch(err)
      {
          res.json({message:err})}    
      });


   
 
    //delete from calss

 router.delete("/",verify,async (req,res)=>{
  try{
    
    let id =req.body.id
    const data = await class1.updateOne({"semester":req.body.semester}
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
  semester:req.body.semester,
   etudient:req.body.etudient,
   module:req.body.module
  })

 const savedClass=  await clas.save()
 
res.send(savedClass)

}catch(err){
  res.json(err)
}
})
//get class
router.get('/class',verify,async(req,res)=>{
try{const clas= await class1.find({"name":req.body.semester}).populate('etudient','name prenom email apogee').exec()
res.json(clas)}catch(err){res.json(err)}

})
//get all class
router.get('/allclass',verify,async (req,res)=>{

    try {
    
      
      const all= await class1.find()
      .populate('etudient',"name prenom apogee email ")
      .exec()
 
  
     res.send(all)
    } catch (error) {
      res.send(error)
    }

  
  })
  
module.exports=router;