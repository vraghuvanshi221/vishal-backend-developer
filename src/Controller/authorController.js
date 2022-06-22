
const { isValidObjectId } = require("mongoose")
const authorModel = require("../Model/authorModel")

// ---------------------***----------createAuthor--------------***------------------//
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};

const validateEmail = function (mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }

};


const createAuthor = async (req, res) => {
    try {
        let data = req.body
        //validation 
        if (data.fName == undefined) return res.status(400).send({ status: false, msg: "fName is required" })
        if (data.lName == undefined) return res.status(400).send({ status: false, msg: "lName is required" })
        if (data.title == undefined) return res.status(400).send({ status: false, msg: "title is required" })
        if (data.email == undefined) return res.status(400).send({ status: false, msg: "email is required" })
        if (data.password == undefined) return res.status(400).send({ status: false, msg: "password is required" })

        if (!isValid(data.fName)) return res.status(400).send({ status: false, msg: "invalid fName" })
        if (!isValid(data.lName)) return res.status(400).send({ status: false, msg: "invalid lName" })
        if (!isValid(data.title)) return res.status(400).send({ status: false, msg: "invalid title" })
        if (!isValid(data.email)) return res.status(400).send({ status: false, msg: "email is not empty" })
        if (!isValid(data.password)) return res.status(400).send({ status: false, msg: "invalid password" })

        if (!validateEmail(data.email)) return res.status(400).send({ status: false, msg: "invalid email" })

        let isUniqueEmail = await authorModel.findOne({ email: data.email })
        if (isUniqueEmail) return res.status(400).send({ status: false, msg: "already exits" })


        let arrKeys = Object.keys(data);
        if (arrKeys.length == 0) return res.status(400).send({ status: true, msg: "Data is required" })
        let created = await authorModel.create(data)
        res.status(201).send({ status: true, data: created })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createAuthor = createAuthor;
