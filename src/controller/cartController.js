const productModel = require("../models/productModel")
const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const { isValid,
    isValidRequest,
    isValidObjectId,
    removeExtraSpace,
    isValidSize,
    validName,
    isValidNumberInt, isValidNumber, isValidTitle } = require("../validator/validation")
const { uploadFile } = require("../AWS/aws");





const getCart=async (req,res)=>{
    let userId=req.params.userId
    if(!isValidObjectId(userId))return res.status(400).send({status:false,msg:"Send valid userId"});

    let checkUserId=await userModel.findById({userId});
    if(!checkUserId)return res.status(404).send({status:false,msg:"userId doesn't exits"});
    

}