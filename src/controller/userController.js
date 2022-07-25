const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const { uploadFile } = require("../AWS/aws")
const { isValid, isValidMail, isValidMobile, isValidRequest, isValidPassword } = require("../validator/validation")



const registerUser = async function (req, res) {
    try {
        let userDetails = req.body
        let files = req.files
        let { fname, lname, email, phone, password } = userDetails

        let address = req.body.address
        let {shipping, billing} = address
        if (!isValidRequest(userDetails)) {
            return res.status(400).send({ status: false, msg: "Please enter details for user registration." })
        }
        if (!fname) {
            return res.status(400).send({ status: false, msg: "Please enter fname for registration." })
        }
        if (!lname) {
            return res.status(400).send({ status: false, msg: "Please enter lname for registration." })
        }
        if (!email) {
            return res.status(400).send({ status: false, msg: "Please enter email for registration." })
        }
        if (!isValidMail(email)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid email address." })
        }
        let mailCheck = await userModel.findOne({ email })
        if (mailCheck) {
            return res.status(409).send({ status: false, msg: `${email} already registered, try new.` })
        }
        if (!files) {
            return res.status(400).send({ status: false, msg: "Please upload profile image for registration." })
        }
        if (files.length > 0) {
            var uploadedFileURL = await uploadFile(files[0])
        }
        if (!phone) {
            return res.status(400).send({ status: false, msg: "Please enter phone number for registration" })
        }
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid Indian number." })
        }
        let phoneCheck = await userModel.findOne({ phone })
        if (phoneCheck) {
            return res.status(409).send({ status: false, msg: `${phone} already registered, try new.` })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "Please enter a strong password for registration." })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Please enter a password which contains min 8 and maximum 15 letters,upper and lower case letters and a number" })
        }
        if (!address) {
            return res.status(400).send({ status: false, msg: "Please enter address for shippin and billing purpose." })
        }
        let profileImage = uploadedFileURL
        let responseBody = { fname, lname, email, profileImage, phone, password, address }
        let createUser = await userModel.create(responseBody)
        return res.status(201).send({ status: true, data: createUser })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const userLogin = async function (req, res) {
    try {
        let data = req.body

        if (!isValidRequest(data)) {
            return res.status(400).send({ status: false, message: "Invalid Request" })
        }

        let { email, password } = data
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

        let hashedpass = loginUser.password
        const validpass = await bcrypt.compare(password, hashedpass)
        if (!validpass) {
            return res.status(401).send({ status: false, message: "Incorrect Password" })
        }

        let token = jwt.sign(
            {
                userId: loginUser._id,
                iat: Math.floor(Date.now() / 1000),
            }, "pro@3", { expiresIn: '10h' }
        )
        res.setHeader("x-api-key", token)
        let dataToBeSend = { usedId: loginUser._id, token: token }
        res.status(201).send({ status: true, message: 'User login successfull', data: dataToBeSend })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getUser = async function (req, res) {
    try {
        let usedId = req.params.usedId
        //-------------------------------------checking Authorizaton------------------------->>


    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { registerUser, userLogin }