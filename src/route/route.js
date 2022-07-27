const { Route53RecoveryCluster } = require('aws-sdk')
const express= require ('express')
const router = express.Router()
const {registerUser, userLogin, getUser, updateUserDetails } = require('../controller/userController') 
const{createProduct, getProductsById, deleteProductById}=require("../controller/productController")
const {authentication}=require("../middleware/auth")



//<<-----------------------------------------user Model API-------------------------------------------------->>
router.post('/register', registerUser)
router.post("/login", userLogin)
router.get("/user/:userId/profile",authentication, getUser )
router.put("/user/:userId/profile",authentication, updateUserDetails)

// ******************************* PRODUCT APIS **********************************

router.post("/products",createProduct)
router.get("/products/:productId", getProductsById)
router.delete("/products/:productId", deleteProductById)






module.exports=router