const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const { isValid, isValidObjectId, isValidRequest, isValidStatus } = require("../validator/validation")

const createOrder = async function (req, res) {
    try {

        let userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid object id" })
        }
        let userDetails = await userModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ status: false, message: "user not found" })
        }
        //-------------------------------------checking Authorizaton------------------------->>
        if (req.loginId != userId) {
            return res.status(403).send({ status: false, message: "User logged is not allowed to place the order" })
        }

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "Invalid request.Please provide details to place" })
        }
        let { cartId, status, cancellable } = req.body
        //validating cartId
        if (!isValid(cartId)) {
            return res.status(400).send({ status: false, message: "CartId is required to place order" })
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Invalid cartid" })
        }
        let isCartExist = await cartModel.findOne({ _id: cartId })
        if (!isCartExist) {
            return res.status(404).send({ status: false, message: "No cart with this Id found" })
        }
        if(status){
            if (!isValid(status)) {
                return res.status(400).send({ status: false, message: "please send some valid input for status" })
            }
            if (!isValidStatus(status)) {
                return res.status(400).send({ status: false, message: "status should be among [pending, completed, cancled] " })
            }
        }
        else
        status="pending"
         
        if(cancellable)
        {
            if (typeof (cancellable) !== "boolean") {
                return res.status(400).send({ status: false, message: "value of cancellable can be either true or false" })
            }
        }
        else
        cancellable=true

        let qty = 0
        for (let i in isCartExist.items) {
            qty = qty + isCartExist.items[i].quantity
        }

        let orderDetils = {
            userId: userId,
            items: isCartExist.items,
            totalPrice: isCartExist.totalPrice,
            totalItems: isCartExist.totalItems,
            totalQuantity: qty,
            status: status,
            cancellable: cancellable
        }
        let newOrder = await orderModel.create(orderDetils)
        res.status(201).send({ status: true, message: "order Placed", data: newOrder })

    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}


module.exports = { createOrder }