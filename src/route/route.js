const { Route53RecoveryCluster } = require('aws-sdk')
const express= require ('express')
const router = express.Router()
const userController = require('../controller/userController') 



//router.get('/test-me',userController.test)


module.exports=router