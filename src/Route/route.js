const express = require('express')
const authorController = require('../Controller/authorController');
const blogController = require('../Controller/blogController');
const blogMiddleware = require('../Middleware/blogMiddlware')
const loginController = require('../Controller/login')
const authentication = require('../Middleware/authentication')
const router = express.Router();


// Author API's == Create an author - atleast 5 authors ===> no need authentication and authr..
router.post('/authors', authorController.createAuthor) 

// Blog API's yaha create krte time author id to dege hi denge ---> ab authorId se jayege hum emailId pr using populate
router.post('/blogs', authentication.isPresentToken, authentication.isVerifyToken, authentication.createAuthorization, blogMiddleware.isAuthorIdValid, blogController.createBlog)
// working perfect 
// authentication.isPresentToken, authentication.isVerifyToken, authentication.isloggedInUser,
router.delete("/delete/:blogId",  blogController.deleteById)

// working perfect ===> tags prob is here
router.get('/blogs', authentication.isPresentToken, authentication.isVerifyToken, authentication.isloggedInUser, blogController.getBlogs)

//update // put 
router.put("/blogs/:blogId", blogController.updateBlog)

// delete query params
router.delete('/blogs', blogController.deleteBlog)









// phase ---2
// login
router.post('/login', loginController.login)





router.get("/blogs", blogController.getBlogs)

module.exports = router;