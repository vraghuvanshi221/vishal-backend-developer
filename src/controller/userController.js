const userModel = require("../models/userModel")
const bcrypt=require("bcrypt")
const { isValid,
    isValidMail,
    isValidMobile,
    isValidRequest } = require("../validator/validation")



 

const userLogin = async function (req, res) {
    try {
        let data = req.body

        if (!isValidRequest(data)) {
            return res.status(400).send({ status: false, message: "Invalid Request" })
        }

        let {email,password}=data
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        if (!isValidMail(email)) {
            return res.status(400).send({ status: false, message: "Please enter a valid email" })
        }

        const loginUser = await userModel.findOne({ email: email })
        if (!loginUser) {
            return res.status(401).send({ status: false, message: "Incorrect Email" }) //login email and password does not match validation.
        }
      
        let hashedpass=loginUser.password
        const validpass=await bcrypt.compare(password,hashedpass)
        if(!validpass)
        {
            return res.status(401).send({ status: false, message: "Incorrect Password" }) 
        }

     let token = jwt.sign(
            {
                userId: loginUser._id,
                iat: Math.floor(Date.now() / 1000),
            }, "pro@3", { expiresIn: '10h' }
        )
        res.setHeader("x-api-key", token)
        let dataToBeSend={usedId:loginUser._id,token:token}
        res.status(201).send({ status: true, message: 'User login successfull', data:dataToBeSend }) 

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getUser=async function(req,res){
    try{
        let usedId=req.params.usedId
        //-------------------------------------checking Authorizaton------------------------->>
        

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports={userLogin}