const jwt =require('jsonwebtoken');


module.exports= function (req, res,next){

    const token =req.header('token')
    if(!token) return res.status(401).send('Acces denai11')
    try{
        const verified = jwt.verify(token ,'hamza25463')
        req.user = verified;
        next()
    }catch(err){
        res.status(400).send('invalide  token ');
    }
}