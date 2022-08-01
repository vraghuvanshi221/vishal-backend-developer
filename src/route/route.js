const { Route53RecoveryCluster } = require('aws-sdk')
const express = require('express')
const router = express.Router()
const { registerUser, userLogin, getUser, updateUserDetails } = require('../controller/userController')
const { createProduct, updateProductDetails, getProduct, getProductsById, deleteProductById } = require("../controller/productController")
const {createCart,getCart} = require("../controller/cartController")
const { authentication } = require("../middleware/auth")



//<<-----------------------------------------user Model API-------------------------------------------------->>
router.post('/register', registerUser)
router.post("/login", userLogin)
router.get("/user/:userId/profile", authentication, getUser)
router.put("/user/:userId/profile", authentication, updateUserDetails)

// ******************************* PRODUCT APIS **********************************

router.post("/products", createProduct);
router.get("/products", getProduct)
router.get("/products/:productId", getProductsById);
router.put("/products/:productId", updateProductDetails);
router.delete("/products/:productId", deleteProductById);

// ****************************** Cart APIs ***************************

router.post("/users/:userId/cart",createCart);
router.get("/users/:userId/cart",getCart);


// ==========> This API is used for handling any invalid Endpoints <=========== 
router.all("/*", async function (req, res) {
  res.status(404).send({ status: false, msg: "Page Not Found!!!" });
});




module.exports = router