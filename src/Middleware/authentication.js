
const jwt = require('jsonwebtoken')
const isPresentToken = function (req, res, next) {
   
    if (!(req.headers["x-api-key"] || req.headers["x-api-key"])) {
        res.send({ status: false, msg: "token must be present" })
    }
    else {
        next()
    }
}
const isVerifyToken = function (req, res, next) {
    let token = req.headers["x-api-key"]
    let decodedToken = jwt.verify(token, "project1");

    try{
        if (!decodedToken) {
            res.send({ status: false, msg: "token is invalid" });
        }
        next()
    }catch(err)
    {
        res.send({ status: false, msg: "token is invalid" });
    }

  
}


const isloggedInUser = function(req,res,next)
{
    let token = req.headers["x-api-key"]
    let decodedToken = jwt.verify(token, "project1");
    let userToBeModified = req.params.authorId;
    let userLoggedIn= decodedToken.authorId
    if(userToBeModified!=userLoggedIn) return res.send({status:false,msg:"user logedin is not allowed to modify  the request"})
    next()

}
const authorModel = require('../Model/authorModel')
//creation specify person
const createAuthorization = async function(req,res,next)
{
    let token = req.headers["x-api-key"]
    let decodedToken = jwt.verify(token, "project1");
    console.log(decodedToken)
    let userToBeCreated = req.body.authorId
    console.log(userToBeCreated)
    let oneUserFullData=await authorModel.findById(userToBeCreated)
    console.log(oneUserFullData)
    let myemil = oneUserFullData.email
    console.log(myemil)
    let userLoggedIn= decodedToken.authorId
    console.log(userLoggedIn)
    if(myemil!=userLoggedIn) return res.send({status:false,msg:"user logedin is not allowed to modify  the request"})
    next()

}

module.exports={isPresentToken,isVerifyToken,isloggedInUser,createAuthorization}