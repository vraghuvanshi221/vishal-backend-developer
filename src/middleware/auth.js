const jwt=require("jsonwebtoken")

const authentication = async function (req, res, next) {
    try {
       // let token = req.headers['x-api-key'] || req.headers['x-Api-key']
       let token=req.headers.authorization.split(" ")
       token=token[1]
        if (!token) return res.status(401).send({ status: false, message: "token must be present" });

        let decodedtoken = jwt.verify(token, "pro@3")
       // if (!decodedtoken) return res.status(400).send({ status: false, message: "token is invalid" });

      
        req.loginId = decodedtoken.userId
        //req["x-api-key"] = decodedtoken
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

module.exports={authentication}