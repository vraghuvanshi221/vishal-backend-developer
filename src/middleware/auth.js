const jwt=require("jsonwebtoken")

const authentication = async function (req, res, next) {
    try {
       
       let bearerToken=req.headers.authorization
       if (!bearerToken)
        return res.status(401).send({ status: false, message: "bearer token must be present" });
       bearerToken=bearerToken.split(" ")
       let token=bearerToken[1]
        
        jwt.verify(token, "pro@3",function(err,decodedtoken){
            if (err) {
                return res.status(400).send({ status: false, message: err.message })}
            else 
            {
                req.loginId = decodedtoken.userId
                next()
                
            }
        })
     
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};

module.exports={authentication}