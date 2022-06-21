
const blogModel = require('../Model/blogModel')


let isAuthorIdValid = async function(req,res,next)
{
    try{
        let authorId= req.body.authorId
        if(!authorId) return res.send()
        let isIdAvailable= await blogModel.findById(authorId);
        if(!isIdAvailable)
        {
            res.status().send()
        }
        else{
            
        }




        next();
    }catch(err)
    {
        res.status(500).send({})
    }
}
 


module.exports={
    isAuthorIdValid
}