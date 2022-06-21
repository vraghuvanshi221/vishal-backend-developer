const express = require('express')
const authorController = require('../Controller/authorController');
const blogController = require('../Controller/blogController');
const blogMiddleware = require('../Middleware/blogMiddlware')
const router = express.Router();


// Author API's == Create an author - atleast 5 authors
router.post('/authors', authorController.createAuthor)

// Blog API's
router.post('/blogs', blogMiddleware.isAuthorIdValid, blogController.createBlog)
// working perfect 
router.delete("/delete/:blogId", blogController.deleteById)

// working perfect ===> tags prob is here
router.get('/blogs', blogController.getBlogs)



router.put("/blogs/:blogId", blogController.updateBlog)





//here i am creating delete api
router.delete('/blogs/:blogId',blogController.deleteBlog)




module.exports = router;