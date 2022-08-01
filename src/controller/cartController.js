const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const { isValid, isValidObjectId,isValidRequest } = require("../validator/validation")



const updateCart = async function (req, res) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user id" })
        }
        let userDetails = await userModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ status: false, message: "user not found" })
        }
        //-------------------------------------checking Authorizaton------------------------->>
        // if (req.loginId != userId) {
        //     return res.status(403).send({ status: false, message: "User logged is not allowed to update the cart details" })
        // }

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "Invalid request.Please provide details to update" })
        }

        const { cartId, productId } = req.body
        let isCartExist = await cartModel.findOne({ _id: cartId, userId: userId })
        if (!isCartExist) {
            return res.status(404).send({ status: false, message: "No cart with this Id found" })
        }

let  productExistInCart=0

        let { removeProduct } = req.body

        if (!(isValid(removeProduct) && (removeProduct == 0 || removeProduct == 1))) {
            return res.status(400).send({ status: false, message: "removeProduct key is required and its value can be either 0 or 1" })
        }

        else if (removeProduct == 0) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Invalid cartid" })
            }
            if (!isValidObjectId(productId)) {
                return res.status(400).send({ status: false, message: "Invalid productid" })
            }
            let productExist = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!productExist) {
                return res.status(404).send({ status: false, message: "No Product with this Id found" })
            }
            let filter={
                _id: cartId,
               items:{"productId":productId}         
             }
             
            // let update = 
            // "[  {$inc: { totalPrice: -1*items.$.quantity* productExist.price },{$pull: { items:{productId: productId }}]"
            //{$pull:{items:{productId:productId}}}

            let price=productExist.price
             productExistInCart = await cartModel.findOneAndUpdate(filter,
                {$inc: { totalPrice: - 1*price }},{ new: true })
            // if (!productExistInCart) {
            
            //     return res.status(404).send({ status: false, message: "No Product with this Id found in this Cart" })
            // }
        }
        else if (removeProduct == 1) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Invalid cartid" })
            }
            if (!isValidObjectId(productId)) {
                return res.status(400).send({ status: false, message: "Invalid productid" })
            }
            let productExist = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!productExist) {
                return res.status(404).send({ status: false, message: "No Product with this Id found" })
            }
            let update = {

                $inc: { "items.$.productId": { "items.$.quantity": -productExist.price } }
            }
            let productExistInCart = await cartModel.findOneAndUpdate({ _id: cartId, items: { $in: productId } }, update, { new: true })
            
            if (!productExistInCart) {
                return res.status(404).send({ status: false, message: "No Product with this Id found in this Cart" })
            }
        }
        //productExistInCart[_doc][productdetails] = productExist
        res.status(200).send({ status: true, message: "updated sucessfully", data: productExistInCart })

    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

const deleteCart = async function (req, res) {
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
            return res.status(403).send({ status: false, message: "User logged is not allowed to delete the cart details" })
        }
        let update = {
            $pull: items,
            totalPrice: 0,
            totalItems: 0
        }
        let deletetedCart = await cartModel.findOneAndUpdate({ userId: userId }, update, { new: true })
        if (!deletetedCart) {
            return res.status(404).send({ status: false, message: "cart of this user id not found" })
        }
        res.status(204).send({ status: true, message: "deleted sucessfully" })
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

module.exports = { updateCart, deleteCart }