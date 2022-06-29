const { response } = require('express')
let collegeModel = require('../Models/CollegeModel')
let { isValid, isValidName } = require('../Validator/validation')
let mongoose = require('mongoose')
const { query } = require('express');
const internModel = require("../Models/InternModel");
const { find } = require('../Models/CollegeModel');
const CollegeModel = require('../Models/CollegeModel');


let createCollegeData = async function (req, res) {
    try {
        let collegeData = req.body
        const { name, fullName, logoLink } = collegeData

        if (!isValid(fullName)) return res.status(400).send({ status: false, msg: "fullName is required" })
        if (!isValid(fullName)) return res.status(400).send({ status: false, msg: "fullName is required" })


        if (Object.keys(collegeData).length == 0) return res.status(400).send({ status: false, msg: "Body can not be empty " })

        if (!isValid(name)) return res.status(400).send({ status: false, msg: "name is required field, please enter" })
        if (!isValidName(name)) return res.status(400).send({ status: false, msg: "please enter valid name(between A-Z or a-z)" })

        let Lname = name.toString().toLowerCase()
        collegeData.name = Lname

        let checkNameNotDeleted = await collegeModel.find({ name: name, isDeleted: false })
        let checkNameifDeleted = await collegeModel.find({ name: name, isDeleted: true })

        if (!isValid(fullName)) return res.status(400).send({ status: false, msg: "fullName is required" })
        if (!isValid(logoLink)) return res.status(400).send({ status: false, msg: "link is required" })

        if (checkNameNotDeleted.length != 0) return res.status(400).send({ status: false, msg: "college name is already present " })
        if (checkNameifDeleted.length != 0) return res.status(400).send({ status: false, msg: "data with this name already present but it is deleted ,undo the delete" })

        let saveData = await collegeModel.create(collegeData)
        res.status(201).send({ status: true, Data: saveData })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
};


const collegeDetails = async function (req, res) {
    try {
        let data = req.query.totr
        if(Object.keys(data).length===0) return res.status(404).send({status:false,message:"college name is not given"})
  
        if(!isValid(data.collegeName)) return res.status(400).send({status:false,message:"college name can't be empty"})
        
  
        let college = await collegeModel.findOne({ name: data.collegeName,isDeleted:false })
        if(!college) return res.status(404).send({status:false,message:"No such college exists"})
  
  
        let allInters = await internModel.find({collegeId:college._id,isDeleted:false}).select({_id:1,name:1,email:1,mobile:1})
        if(allInters.length===0) return res.status(404).send({status:false,message:"No interns in this college"})
  
        let InternsInCollege = {
            "name": college.name,
            "fullName": college.fullName,
            "logoLink": college.logoLink,
            "interns": allInters
        }
  
        res.status(200).send({status:true,data:InternsInCollege})
    }
    catch (err) {
        res.send(err.message)
    }
}
//         let query = req.query
//         if (!("collegeName" in query)) return res.status(400).send({ status: false, msg: "collegeName query parameter is missing" })

//         if (query.collegeName == '') return res.status(400).send({ status: false, msg: "Please provide a Valid collegeName" })
        
//             let getSpecificInten = await internModel.find({ $and: [{ isDeleted: false }, query]}).populate("collegeId")
//             if (getSpecificInten.length == 0) {
//                 return res.status(400).send({ status: false, msg: "No such intern found" })
//             }
//             else {
//                 return res.status(200).send({ status: true, data: getSpecificInten })
//             }

         
//     }
//     catch (error) {
//         console.log(error)
//         res.status(500).send({ status: false, err: error.message });

//     }

// }




module.exports = { createCollegeData, collegeDetails }