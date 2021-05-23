const express = require('express')
const app =express();
const authRoute=require('./Routes/log');
const getUser=require('./Routes/getUser')
const reponces=require('./Routes/send_reponces')
const ExamHandller=require('./Routes/ExamOperation')
//data base 
const mongoose =require('mongoose')
mongoose.connect(
    'mongodb://localhost:27017/online',{ useNewUrlParser: true ,useUnifiedTopology: true},()=>{
    console.log('...............');
});




//Route midelware 
const bodyParser=require('body-parser')
app.use(bodyParser.json());

app.use('/',authRoute)
app.use('/admin',getUser)
app.use('/exam',ExamHandller)
app.use('/reponces',reponces)




app.listen(3000)