const mongoose = require('mongoose')
const blogModel = require('../Model/blogModel')
const authorModel = require('../Model/authorModel')



// here first check that id is present or not 
// if present than it's available in database or not means valid or not

let isAuthorIdValid = async function(req,res,next)
{
    try{
        let authorId= req.body.authorId
        if(!authorId) return res.status(400).send({status:false, mess:"author id is mandatory"})
        if(!mongoose.Types.ObjectId.isValid(authorId)) return res.status(400).send({status:false, mess:"Please enter a valid id "})
        let isIdAvailable= await authorModel.findById(authorId);
        // if(!isIdAvailable) return res.status(400).send({status:false, msg:"Please enter a valid id"})
        next();
       
    }catch(err)
    {
        res.status(500).send({status:false, msg:"Internal server Error"})
    }
}
 


module.exports={
    isAuthorIdValid
}