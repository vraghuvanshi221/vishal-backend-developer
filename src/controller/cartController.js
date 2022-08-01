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
               "items.$.productId":productId         
             }
            //  let quantity= isCartExist.items.map((product) => (if(product["productId"] = product["productId"].toString() return product[quantity]))
let qty=0
             for(let i in isCartExist.items){
                 console.log(isCartExist.items[i].quantity)
                 if(isCartExist.items[i].productId==productId){
                     console.log("hello")
                     qty=isCartExist.items[i].quantity
                 }
             }
             console.log(qty)
            // let update = 
            // "[  {$inc: { totalPrice: -1*items.$.quantity* productExist.price },{$pull: { items:{productId: productId }}]"
            //{$pull:{items:{productId:productId}}}

            let price=productExist.price
             productExistInCart = await cartModel.findOneAndUpdate(filter,
                {$inc: { totalPrice: - 1*qty*price }},{ new: true })
            if (!productExistInCart) {
            
                return res.status(404).send({ status: false, message: "No Product with this Id found in this Cart" })
            }
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




// ******************************** create cart ******************************** 

const createCart = async function (req, res) {
    try {
        const data = req.body;
        const userIdbyParams = req.params.userId;
        let { productId, cartId } = data;
        let cartIdpresent = 0

        // For data

        if (!isValidRequest(data)) {
            return res.status(400).send({ status: false, message: "Enter valid Input" })
        }
        if (!isValid(data)) {
            return res.status(400).send({ status: false, message: "Enter Input" })
        }


        // For userId from params

        // if (!userIdbyParams)
        //     return res.status(400).send({ status: false, message: "Enter userId" })

        if (!isValidObjectId(userIdbyParams)) {
            return res.status(400).send({ status: false, message: 'Please provide valid userId in Params' })
        }

        const userIdpre = await userModel.findById(userIdbyParams);
        if (!userIdpre)
            return res.status(404).send({ status: false, message: "User does not exist in user collection that input in params" })



        // Authorization

        // if (req.loginId != userIdbyParams) {
        //     return res.status(403).send({ status: false, message: "Unauthorize user" })
        // }

        // For productId


        if (!productId)
            return res.status(400).send({ status: false, message: "Enter productId" })

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: 'Please provide valid productId' })
        }
        const isProductPresent = await productModel.findOne({ _id: productId, isDeleted: false });

        if (isProductPresent == null) return res.status(404).send({ status: false, message: "Product does not exist" });

        // For cart

        if (cartId) {

            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: 'Please provide valid cartId' })
            }

            cartIdpresent = await cartModel.findById(cartId);

            if (cartIdpresent != 0) {

                if (userIdbyParams != cartIdpresent.userId.valueOf()) {
                    return res.status(403).send({ status: false, message: "Cart does not belongs to this user" })
                }

                let isProductPresentInCart = cartIdpresent.items.map((product) => (product["productId"] = product["productId"].toString()))



                if (isProductPresentInCart.includes(productId)) {

                    const updateExistingProductQuantity = await cartModel.findOneAndUpdate({ _id: cartId, "items.productId": productId },
                        { $inc: { totalPrice: +isProductPresent.price, "items.$.quantity": +1, } }, { new: true });


                    return res.status(200).send({ status: true, message: "Product quantity updated to cart", data: updateExistingProductQuantity });
                }
                else {
                    const addNewProductInItems = await cartModel.findOneAndUpdate(
                        { _id: cartId },
                        {
                            $addToSet: { items: { productId: productId, quantity: 1 } },
                            $inc: { totalItems: +1, totalPrice: +isProductPresent.price },
                        },
                        { new: true }
                    );

                    return res.status(200).send({ status: true, message: "Item updated to cart", data: addNewProductInItems, });
                }
            }

        }
        else {
            const isCartPresentForUser = await cartModel.findOne({ userId: userIdbyParams });

            if (isCartPresentForUser != null) {
                return res.status(400).send({ status: false, message: "cart exist for the user so input cart id in body" });
            }

            const productData =
            {
                productId: productId,
                quantity: 1
            }

            const cartData = {
                userId: userIdbyParams,
                items: [productData],
                totalPrice: isProductPresent.price,
                totalItems: 1,
            };

            const addedToCart = await cartModel.create(cartData);

            return res.status(201).send({ status: true, message: "New cart created for the user and product added to cart", data: addedToCart });
        }


    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}





module.exports = {createCart, updateCart, deleteCart }
