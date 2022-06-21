const blogModel = require("../Model/blogModel")
const  mongoose = require("mongoose")

const getBlogs = async function (req, res) {
    try {
      let data = req.query;
      let filter = {
        isdeleted: false,
        isPublished: true,
    
      };
 
      const { category, subcategory, tags } = data
  
      if (category) {
        let verifyCategory = await blogModel.findOne({ category: category })
        if (!verifyCategory) {
          return res.status(404).send({ status: false, msg: 'No blogs in this category exist' })
        }
      }
  
      if (tags) {
  
        if (!await blogModel.exists(tags)) {
          return res.status(404).send({ status: false, msg: 'no blog with this tags exist' })
        }
      }
  
      if (subcategory) {
  
        if (!await blogModel.exists(subcategory)) {
          return res.status(404).send({ status: false, msg: 'no blog with this subcategory exist' })
        }
      }
  
      let getSpecificBlogs = await blogModel.find(filter);
  
      if (getSpecificBlogs.length == 0) {
        return res.status(404).send({ status: false, data: "No blogs can be found" });
      } 
      else {
        return res.status(200).send({ status: true, data: getSpecificBlogs });
      }
    } 
      catch (error) {
      res.status(500).send({ status: false, err: error.message });
    }
  };

const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).send("No such exits blog ");
        };
        let blogData = req.body;
        let updateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, blogData);
        return res.status(200).send({ status: true, data: updateBlog });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }
};

const deleteBlog = async function (req, res) {
    let blogId = req.query.queryParams
    let blog = await blogModel.findById(blogId);
    if (!blog)
        res.status(404).send({ status: false, msg: "Data doesn't exits" })
    // let updateBlog= await blogModel.findOneAndUpdate({_id:userId},{$set:{isDeleted:true}},{new:true})
    // res.send ({status:true,data:updateBlog})
};
module.exports.getBlogs =getBlogs
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;

//const blogModel = require("../Model/blogModel")


  

 
