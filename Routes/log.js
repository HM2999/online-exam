
const user =require('../module/user')
const { request } = require('express');
const  express = require('express');
const router = express.Router();
const {loginValidation,registerValidation}=require('./accessController/validation')
const bcrypt =require('bcryptjs')
const jwt =require('jsonwebtoken')
const verify = require('./accessController/TokenValidator');


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



//inscription 
router.post('/',async (req,res)=>{
const {error}=registerValidation(req.body)
if(error) return res.status(400).send(error.details[0].message)

const emailexiste = await user.findOne({email:req.body.email})
if(emailexiste) return res.status(400).send('email is already exist');

//hach the pasword 
const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(req.body.password, salt)

    const User = new user({
        name:req.body.name,
        password : hashPassword,
        email:req.body.email,
        apogee:req.body.apogee,
        access:req.body.access
    });

try{  
const savedPost= await User.save();
savedPost.password="";
console.log(savedPost)
res.json(savedPost);
} 
catch(err){

    res.status(400).send(err);
}
});


//login validation 
router.post('/login',async (req,res)=>{
    const {error}=loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let User = await user.findOne({email:req.body.email})
if(!user) return res.status(400).send('email or password is wrong');

const validPass = await bcrypt.compare(req.body.password,User.password);
if(!validPass)return res.status(400).send('pass wrong');
if(req.body.access!=User.access)return res.status(401).send('access denai');
// create a token


const token = jwt.sign({_id:User._id},'hamza25463')

const data =await user.findById(User._id)
.populate('class')
data.password=''

const fin = {
    data,
    "token":token
}
res.json(fin)

});

router.post('/ph',verify,upload.single('Img'),async (req,res)=>{
try{

   const user= await user.updateOne({"_id":req.body._id},{

    $set:{
     "photo":file.path
         }
      });
      console.log(user)
      res.send(user)
  
    } catch (err) {
      res.json(err)
    }
    })



module.exports=router;