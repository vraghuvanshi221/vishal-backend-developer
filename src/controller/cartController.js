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

        if (!userIdbyParams)
            return res.status(400).send({ status: false, message: "Enter userId" })

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
        
        const isProductPresent = await productModel.findOne({ _id: productId, isDeleted: false })

        if (isProductPresent == null) return res.status(404).send({ status: false, message: "Product does not exist" });

        // For cart
        const isCartPresentForUser = await cartModel.findOne({ userId: userIdbyParams });

        if (isCartPresentForUser != null) {

            cartIdpresent = isCartPresentForUser


            let isProductPresentInCart = cartIdpresent.items.map((product) => (product["productId"] = product["productId"].toString()))



            if (isProductPresentInCart.includes(productId)) {

                const updateExistingProductQuantity = await cartModel.findOneAndUpdate({ _id: cartIdpresent._id, "items.productId": productId },
                    { $inc: { totalPrice: +isProductPresent.price, "items.$.quantity": +1, } }, { new: true }).populate([{ path: "items.productId" }])

        
                return res.status(200).send({ status: true, message: "Product quantity updated to cart", data: updateExistingProductQuantity });
            }
            else {
                const addNewProductInItems = await cartModel.findOneAndUpdate(
                    { _id: cartIdpresent._id },
                    {
                        $addToSet: { items: { productId: cartIdpresent, quantity: 1 } },
                        $inc: { totalItems: +1, totalPrice: +isProductPresent.price },
                    },
                    { new: true }).populate([{ path: "items.productId" }]);

                return res.status(200).send({ status: true, message: "Item updated to cart", data: addNewProductInItems, });
            }


        }
        else {
            
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
};


//=================getCart by UserId======================//


const getCart = async (req, res) => {

    try {

        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "Send valid userId" });

        let checkUserId = await userModel.findById(userId);
        if (!checkUserId) return res.status(404).send({ status: false, msg: "userId doesn't exits" });

        // if(userId!=req.loginId) return res.status(403).send({status:false,msg:"unauthorized user"});

        let cart = await cartModel.findOne({ userId: userId });
        if (cart == null) return res.status(404).send({ status: false, msg: "cart not available" });

        return res.status(200).send({ status: true, msg: "cart found", data: cart });


    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}




module.exports = { createCart, getCart };
