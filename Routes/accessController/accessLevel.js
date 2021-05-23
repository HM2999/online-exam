const Exam = require('../../module/Exam')
const user =require('../../module/user')
const { request } = require('express');
const  express = require('express');
const { model } = require("mongoose");


isAdmin=  async (req, res,next)=>{

    if(req.body.access=='admin') next()
}
cancreat=  async (req, res,next)=>{

    if(req.body.access=='admin'||req.body.access=='prof') next()
}
canEditeExam=  async (req, res,next)=>{

    const exam1= await exam.findOne({_id:req.body._id})
    if(req.body.access=='admin'||(req.body.access=='prof'&&req.body.profid==exam1.prof)) next()
}


module.exports = {
  isAdmin,
  canEditeExam,cancreat
}