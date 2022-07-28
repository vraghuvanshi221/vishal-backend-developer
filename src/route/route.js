const { Route53RecoveryCluster } = require('aws-sdk')
const express= require ('express')
const router = express.Router()
const {registerUser, userLogin, getUser, updateUserDetails } = require('../controller/userController')
const {getProduct} = require("../controller/productController")
const {authentication}=require("../middleware/auth")



//router.get('/test-me',userController.test)
router.post('/register', registerUser)
router.post("/login", userLogin)
router.get("/user/:userId/profile",authentication, getUser )
router.put("/user/:userId/profile", updateUserDetails)
router.get("/products", getProduct)


module.exports=router