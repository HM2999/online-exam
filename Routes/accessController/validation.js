//validation 
const { date } = require('@hapi/joi');
const Joi = require('@hapi/joi');

const registerValidation= data =>{
    const schema ={
    
        name : Joi.string().min(3).required(),
        prenom:Joi.string(),
        email : Joi.string().min(6).required(),
        password : Joi.string().min(6).required(),
        apogee:Joi.number().max(10000000),
        module:Joi.string(),
        access:Joi.string().required()

    };
    return Joi.validate(data, schema);
    }


    const loginValidation= data =>{
        const schema ={
            email : Joi.string().min(6).required(),
            password : Joi.string().min(6).required(),
            access:Joi.string().required()
        };
        return Joi.validate(data, schema);
        }

const repancesValidation = data =>{

const schema =  {
user:Joi.required(),
reponces:Joi.object().keys({
content:Joi.string(),
choix:Joi.array(),
date:Joi.string()
})
,exam:Joi.required()
}

        return Joi.validate(data.body, schema);
    }


const ExamenValidation = data =>{

    const schema =  {
    prof:Joi.required(),
    class:Joi.required(),
    module:Joi.string(),
    date:Joi.date(),

    Question:Joi.object().keys({
            content:Joi.string().required(),
            option:Joi.array().required(),
            src:Joi.string(),
            correction:Joi.array().required(),
            number:Joi.number().required(),
            barem:Joi.number().required()
    })
    
    }
    
            return Joi.validate(data.body, schema);
        }
    
        module.exports.ExamenValidation=ExamenValidation;


        module.exports.repancesValidation=repancesValidation;

        module.exports.registerValidation= registerValidation;
        module.exports.loginValidation= loginValidation;