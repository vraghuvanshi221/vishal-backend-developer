const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const { isValid,
    isValidMail,
    isValidMobile,
    isValidRequest } = require("../validator/validation")

// Regex. Remove this if function is build in validation file. 

const streetRegex = /^([a-zA-Z0-9 ]{2,50})*$/
const cityRegex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/
const pincodeRegex = /^\d{6}$/




// *********************************  API 2  ***************************

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



// *************************************** API 3 ***************************************

const getUser = async function (req, res) {
    try {
        let usedId = req.params.usedId
        //-------------------------------------checking Authorizaton------------------------->>


    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



// **********************************  API 4  **********************************


const updateUserDetails = async (req, res) => {

    try {
        let data = req.body

        let userId = req.params.userId
        let file = req.files

        // validate body 
        if (!isValidRequest(data)) {
            return res.status(400).send({ status: false, message: "Invalid Request" })
        }
        if (!isValid(data)) {
            return res.status(400).send({ status: false, message: "Invalid Request" })
        }

        const findUserData = await userModel.findById(userId)
        if (!findUserData) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        // check authorization 

        let { fname, lname, email, phone, password, address, profileImage } = data
        let obj = {}

        if (fname) {
            // validate fname
            obj.fname = fname
        }

        if (lname) {
            // validate lname
            obj.lname = lname
        }

        if (email) {
            if (!isValidMail(email)) {
                return res.status(400).send({ status: false, message: "email is required" })
            }

            const checkEmailFromDb = await userModel.findOne({ email: email })

            if (checkEmailFromDb && checkEmailFromDb != null)
                return res.status(400).send({ status: false, message: "EmailId Exists. Please try another email Id." })
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

            if (!(password.length >= 8 && password.length <= 15)) {
                return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " })
            }
            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(password, salt)
            obj.password = newPassword

        }

        if (address) {

            if (address.shipping) {

                if (address.shipping.street) {
                    if (!streetRegex.test(address.shipping.street)) {
                        return res.status(400).send({
                            status: false, message: "Street should be Valid and Its alphabetic and Number",
                        });
                    }
                    obj.address.shipping.street = address.shipping.street

                }

                if (address.shipping.city) {
                    if (!cityRegex.test(address.shipping.city)) {
                        return res.status(400).send({
                            status: false, message: "City should be Valid and Its alphabetic",
                        });
                    }

                    obj.address.shipping.city = address.shipping.city
                }

                if (address.shipping.pincode) {
                    if (!pincodeRegex.test(address.shipping.pincode)) {
                        return res.status(400).send({
                            status: false, message: "Pincode should have only 6 digits. No alphabets",
                        });
                    }
                    obj.address.shipping.pincode = address.shipping.pincode
                }
            }

            if (address.billing) {

                if (address.billing.street) {
                    if (!cityRegex.test(address.billing.street)) {
                        return res.status(400).send({
                            status: false, message: "City should be Valid and Its alphabetic",
                        });
                    }

                    obj.address.billing.street = address.billing.street
                }

                if (address.billing.city) {
                    if (!cityRegex.test(address.billing.city)) {
                        return res.status(400).send({
                            status: false, message: "City should be Valid and Its alphabetic",
                        });
                    }
                    obj.address.billing.city = address.billing.city

                }

                if (address.billing.pincode) {
                    if (!pincodeRegex.test(address.billing.pincode)) {
                        return res.status(400).send({
                            status: false, message: "Pincode should have only 6 digits. No alphabets",
                        });
                    }
                    obj.address.billing.pincode = address.billing.pincode
                }
            }
        }

        if (profileImage) {
            if (file) {

                if (!(file && file.length > 0))
                    return res.status(400).send({ status: false, message: "please provide profile image" })

                let userImage = await aws_s3.uploadFile(file[0])
                obj.profileImage = userImage
            }

        }

        let updateProfileDetails = await userModel.findOneAndUpdate({ _id: userId }, { $set: obj }, { new: true })

        return res.status(200).send({ status: true, message: "User Update Successful!!", data: updateProfileDetails })



    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message })
    }
}








module.exports = { userLogin, getUser, updateUserDetails }