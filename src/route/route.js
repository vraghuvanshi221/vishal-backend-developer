const { Route53RecoveryCluster } = require('aws-sdk')
const express= require ('express')
const router = express.Router()
<<<<<<< HEAD
const {registerUser, userLogin, getUser, updateUserDetails } = require('../controller/userController')
const {getProduct} = require("../controller/productController")
=======
const {registerUser, userLogin, getUser, updateUserDetails } = require('../controller/userController') 
const{createProduct,updateProductDetails, getProductsById, deleteProductById}=require("../controller/productController")
>>>>>>> 85e4983c03950be3c78ba84b7cf162be7b12920d
const {authentication}=require("../middleware/auth")



//<<-----------------------------------------user Model API-------------------------------------------------->>
router.post('/register', registerUser)
router.post("/login", userLogin)
router.get("/user/:userId/profile",authentication, getUser )
<<<<<<< HEAD
router.put("/user/:userId/profile", updateUserDetails)
router.get("/products", getProduct)
=======
router.put("/user/:userId/profile",authentication, updateUserDetails)

// ******************************* PRODUCT APIS **********************************

router.post("/products",createProduct);
router.put("/products/:productId",updateProductDetails);
router.get("/products/:productId", getProductsById);
router.delete("/products/:productId", deleteProductById);

// ==========> This API is used for handling any invalid Endpoints <=========== 
router.all("/*", async function (req, res) {
    res.status(404).send({ status: false, msg: "Page Not Found!!!" });
  });




>>>>>>> 85e4983c03950be3c78ba84b7cf162be7b12920d


module.exports=router