const express = require('express')
const app =express();
const authRoute=require('./Routes/log');
const getUser=require('./Routes/getUser')
const reponces=require('./Routes/send_reponces')
const ExamHandller=require('./Routes/ExamOperation')
const GetNotes=require('./Routes/getnote')
//data base 
const mongoose =require('mongoose')
mongoose.connect(
    'mongodb://localhost:27017/online',{ useNewUrlParser: true ,useUnifiedTopology: true},()=>{
    console.log('...............');
});



//Route midelware 
const bodyParser=require('body-parser');
const { array } = require('@hapi/joi');
app.use(bodyParser.json());

// app.use((req,res,next)=>{
// res.header("Access-Control-Allow-Origin","*");
// res.header("Access-Control-Allow-Headers","*");
// if(req.method==='OPTIONS')
// res.header("Access-Control-Allow-Methods",'PUT','POST','GET','PATCH','DELETE','UPDATE')
// return res.status(200).json("hi")
// })
var cors = require('cors')


app.use(cors())




app.use('/',authRoute)
app.use('/admin',getUser)
app.use('/exam',ExamHandller)
app.use('/reponces',reponces)
app.use('/affichage',GetNotes)




app.listen(3000)