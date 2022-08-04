const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const { isValid, isValidObjectId, isValidRequest, isValidStatus } = require("../validator/validation")
const { default: mongoose } = require("mongoose")

const createOrder = async function (req, res) {
    try {

        let userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user id" })
        }
        let userDetails = await userModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ status: false, message: "user not found" })
        }
        //-------------------------------------Checking Authorizaton------------------------->>
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
        if (isCartExist==null) {
            return res.status(404).send({ status: false, message: "No cart with this Id found" })
        }

        if(isCartExist.items.length==0){
            return res.status(404).send({ status: false, message: "No product present in the cart to place order" })  
        }
        if(status){
            if (!isValid(status)) {
                return res.status(400).send({ status: false, message: "please send some valid input for status" })
            }
            if (status!=="pending") {
                return res.status(400).send({ status: false, message: "while placing order status should be pending" })
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

        let update = {
            $set: {items:[]},
            totalPrice: 0,
            totalItems: 0
        }
        let deletetedCart = await cartModel.findOneAndUpdate({ userId: userId }, update, { new: true })
        if (!deletetedCart) {
            return res.status(404).send({ status: false, message: "cart for this user id not found" })
        }
        res.status(201).send({ status: true, message: "order Placed", data: newOrder })

    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        let orderDetails = req.body
        let { orderId, status } = orderDetails

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter valid user id." })
        }

        //================================================Checking Authorizaton================================================//

        if (req.loginId != userId) {
            return res.status(403).send({ status: false, message: "User logged is not allowed to update this order." })
        }

        if (!orderId) {
            return res.status(400).send({ status: false, msg: "Please provide order id." })
        }

        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, msg: "Please enter valid order." })
        }

        let userExist = await userModel.findOne({ _id: userId })
        if (userExist === null) {
            return res.status(400).send({ status: false, msg: "This user is not registered on our platform." })
        }

        let checkOrder = await orderModel.findOne({ _id: orderId })
        if (userId != checkOrder.userId) {
            return res.status(400).send({ status: false, msg: "This order doesn't belong to this user." })
        }

        if (!status) {
            return res.status(400).send({ status: false, msg: "Please enter details for order updation." })
        }
        if (!isValidStatus(status)) {
            return res.status(400).send({ status: false, msg: "We can't proccess this request, because this status is invalid." })
        }

        if(checkOrder.status === "completed"){
            return res.status(400).send({status: false, msg: "We can't process this request, as this order is completed."})
        }

        if(status=== "cancelled"){
            let { cancellable,...rest } = checkOrder
            if (cancellable == false) {
                return res.status(400).send({ status: false, msg: "This product can not be cancelled." })
            }
        }

        const updateOrderStatus = await orderModel.findByIdAndUpdate({ _id: orderId }, orderDetails, { new: true })
        return res.status(200).send({ status: true, msg: "Order status updated successfully.", data: updateOrderStatus })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

module.exports = { createOrder, updateOrder }