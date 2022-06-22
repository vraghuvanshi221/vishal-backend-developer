
const jwt = require('jsonwebtoken')
const isPresentToken = function (req, res, next) {

    if (!(req.headers["x-api-key"])) {
        res.send({ status: false, msg: "token must be present" })
    }
    else {

        next()
    }
}
const isVerifyToken = function (req, res, next) {
    let token = req.headers["x-api-key"]
    try {
        let decodedToken = jwt.verify(token, "project1");
        if (!decodedToken) {
            res.send({ status: false, msg: "token is invalid" });
        }
        next()
    } catch (err) {
        res.send({ status: false, msg: "token is invalid" });

    }

}

let isLoggedinAuthor = function(req,res,next)
{
    let token = req.headers["x-api-key"]
    let decodedToken = jwt.verify(token, "project1");
    let authorId= req.body.authorId
    if(authorId==decodedToken.authorId)
    {
        next()
    }
    else
    {
        res.status(403).send({status:true,msg:"you are not Authorise"})
    }

    
    
}









module.exports = { isPresentToken, isVerifyToken, isLoggedinAuthor}