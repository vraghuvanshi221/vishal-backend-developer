const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { uploadFile } = require("../AWS/aws")
const { isValid, isValidObjectId,
    validName, isValidMail,
    isValidMobile, isValidRequest,
    isValidPassword, isValidStreet,
    isValidCity, isValidPin } = require("../validator/validation")



//==============================================register user==============================================//

const registerUser = async function (req, res) {
    try {
        let userDetails = req.body
        let files = req.files
        let { fname, lname, email, phone, password } = userDetails

        let address =JSON.parse(req.body.address)
        let { shipping, billing } = address

        if (!isValidRequest(userDetails)) {
            return res.status(400).send({ status: false, msg: "Please enter details for user registration." })
        }
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, msg: "Please enter fname for registration." })
        }
        if (!validName(fname)) {
            return res.status(400).send({ status: false, msg: `${fname} is not a valid fname.` })
        }
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, msg: "Please enter lname for registration." })
        }
        if (!validName(lname)) {
            return res.status(400).send({ status: false, msg: `${lname} is not a valid lname.` })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Please enter email for registration." })
        }
        if (!isValidMail(email)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid email address." })
        }
        let mailCheck = await userModel.findOne({ email })
        if (mailCheck) {
            return res.status(409).send({ status: false, msg: `${email} already registered, try new.` })
        }
        if (files.length == 0) {
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
            return res.status(400).send({ status: false, msg: "Please enter a password which contains min 8 and maximum 15 letters." })
        }
        if (password) {
            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(password, salt)
            password = newPassword
        }

        if (address && typeof (address) == {})
            if (!address) {
                return res.status(400).send({ status: false, msg: "Please enter address for shipping and billing purpose." })
            }
        if (!isValid(shipping.street)) {
            return res.status(400).send({ status: false, msg: "please enter street for shipping." });
        }
        if (!isValid(shipping.city)) {
            return res.status(400).send({ status: false, msg: "please enter city for shipping." });
        }
        if (!isValidCity(shipping.city)) {
            return res.status(400).send({ status: false, msg: `${shipping.city} is not a valid city.` })
        }

        if (!isValid(shipping.pincode)) {
            return res.status(400).send({ status: false, msg: "Please enter pincode for shipping." });
        }
        if (!isValidPin(shipping.pincode)) {
            return res.status(400).send({ status: false, msg: `${shipping.pincode} is not a valid pincode.` })
        }
        if (!isValid(billing.street)) {
            return res.status(400).send({ status: false, msg: "Please enter street for billing." });
        }
        if (!isValid(billing.city)) {
            return res.status(400).send({ status: false, msg: "Please enter city for billing." });
        }
        if (!isValidCity(billing.city)) {
            return res.status(400).send({ status: false, msg: `${billing.city} is not a valid city.` })
        }
        if (!isValid(billing.pincode)) {
            return res.status(400).send({ status: false, msg: "please enter pincode for billing." });
        }
        if (!isValidPin(billing.pincode)) {
            return res.status(400).send({ status: false, msg: `${billing.pincode} is not a valid pincode.` })
        }

        let profileImage = uploadedFileURL
        if (!profileImage) {
            return res.status(400).send({ status: false, msg: "don't leave upload files attribute, upload valid files" });
        }
        let responseBody = { fname, lname, email, profileImage, phone, password, address }
        let createUser = await userModel.create(responseBody)
        return res.status(201).send({ status: true, message: "User created successfully.", data: createUser })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
};


//================================================userlogin================================================//

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

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Please enter a password which contains min 8 and maximum 15 " })
        }

        const loginUser = await userModel.findOne({ email: email })
        if (!loginUser) {
            return res.status(401).send({ status: false, message: "Incorrect Email" })
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
        res.status(200).send({ status: true, message: 'User login successfull', data: dataToBeSend })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



//=================================================getUser=================================================//

const getUser = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid object id" })
        }
        //-------------------------------------checking Authorizaton------------------------->>
        if (req.loginId != userId) {
            return res.status(403).send({ status: false, message: "User logged is not allowed to view the profile details" })
        }
        let userDetails = await userModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ status: false, message: "user not found" })
        }
        res.status(200).send({ status: true, message: "User profile details", data: userDetails })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};



//================================================updateUser===============================================//


const updateUserDetails = async (req, res) => {
    try {
        let userId = req.params.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid userId" });
        }

        //==============================checking Authorization===================
        if (req.loginId != userId) {
            return res.status(403).send({ status: false, message: "User logged is not allowed to update the profile details" })
        }


        const findUserData = await userModel.findById(userId)
        if (!findUserData) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        let data = req.body
        let file = req.files
        let address = data.address
        console.log(file)
        if ((Object.keys(data).length == 0) && (!isValid(file))) {
            return res.status(400).send({ status: 400, msg: "Invalid request" });
        }


        let { fname, lname, email, phone, password } = data

        let obj = {}

        if (fname) {
            if (!validName(fname)) {
                return res.status(400).send({ status: false, message: "first name is not in right format" })
            }
            obj.fname = fname
        }

        if (lname) {
            if (!validName(lname)) {
                return res.status(400).send({ status: false, message: "Last name is not in right format" })
            }
            obj.lname = lname
        }

        if (email) {
            if (!isValidMail(email)) {
                return res.status(400).send({ status: false, message: "Email not in right format" })
            }

            const checkEmailFromDb = await userModel.findOne({ email: email })

            if (checkEmailFromDb && checkEmailFromDb != null)
                return res.status(400).send({ status: false, message: "Email-Id Exists. Please try another email Id." })
            obj.email = email
        }

        if (phone) {
            if (!isValidMobile(phone)) {
                return res.status(400).send({
                    status: false, message: "Invalid phone number",
                });
            }

            const checkPhoneFromDb = await userModel.findOne({ phone: phone })

            if (checkPhoneFromDb && checkPhoneFromDb != null) {
                return res.status(400).send({ status: false, message: " Phone number is already in use, Please try a new phone number." })
            }
            obj.phone = phone
        }

        if (password) {

            if (!isValidPassword(password)) {
                return res.status(400).send({ status: false, message: "Password not in right format. Must be 8 to 15 charactes with alphabet and numerical elements" })
            }
            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(password, salt)
            obj.password = newPassword

        }

        if (address) {

            if (address.shipping) {
                if (address.shipping.street) {
                    if (!isValidStreet(address.shipping.street)) {
                        return res.status(400).send({
                            status: false, message: "Street name invalid. It can contain alphabete and Number",
                        });
                    }

                    obj["address.shipping.street"] = address.shipping.street


                }

                if (address.shipping.city) {
                    if (!isValidCity(address.shipping.city)) {
                        return res.status(400).send({
                            status: false, message: "City name invalid. It can contain only alphabete"
                        });
                    }

                    obj["address.shipping.city"] = address.shipping.city
                }

                if (address.shipping.pincode) {
                    if (!isValidPin(address.shipping.pincode)) {
                        return res.status(400).send({
                            status: false, message: "Pincode should have only 6 digits and only number",
                        });
                    }
                    obj["address.shipping.pincode"] = address.shipping.pincode
                }
            }

            if (address.billing) {


                if (address.billing.street) {
                    if (!isValidStreet(address.billing.street)) {
                        return res.status(400).send({
                            status: false, message: "Street name invalid. It can contain alphabete and Number"
                        });
                    }

                    obj["address.billing.street"] = address.billing.street
                }

                if (address.billing.city) {
                    if (!isValidCity(address.billing.city)) {
                        return res.status(400).send({
                            status: false, message: "City name invalid. It can contain only alphabete."
                        });
                    }
                    obj["address.billing.city"] = address.billing.city

                }

                if (address.billing.pincode) {
                    if (!isValidPin(address.billing.pincode)) {
                        return res.status(400).send({
                            status: false, message: "Pincode should have only 6 digits and only numerical elements.",
                        });
                    }
                    obj["address.billing.pincode"] = address.billing.pincode
                }
            }
        }


        if (file) {

            if (file && file.length > 0) {
                const userImage = await uploadFile(file[0])
                obj.profileImage = userImage
            }
            else {
                return res.status(400).send({ status: false, message: "please provide profile image" })
            }
        }



        let updateProfileDetails = await userModel.findOneAndUpdate({ _id: userId }, { $set: obj }, { new: true })

        return res.status(200).send({ status: true, message: "User Update Successfully !!", data: updateProfileDetails })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message })
    }
};

module.exports = { registerUser, userLogin, getUser, updateUserDetails }