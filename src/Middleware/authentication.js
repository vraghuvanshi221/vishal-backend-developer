
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

const authorise = function(req, res, next) {
    try {
    let token = req.headers["x-api-key"]
    if(!token) return res.status(400).send({status: false, msg: "token must be present "})
    let decodedToken = jwt.verify(token, "project1")

    if(!decodedToken) return res.status(403).send({status: false, msg:"token is not valid"})
    
    let userToBeModified = req.params.userId
  
    let userLoggedIn = decodedToken.userId

    if(userToBeModified != userLoggedIn)
     return res.status(403).send({status: false, msg: 'User logged is not allowed to modify the requested users data'}) 
}
     catch (err) {
            console.log("This is the error :", err.message)
            res.status(500).send({ msg: "Error", error: err.message })
        }
  
    next()
};







module.exports = { isPresentToken, isVerifyToken }