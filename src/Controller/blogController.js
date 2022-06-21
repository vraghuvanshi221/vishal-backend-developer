<<<<<<< HEAD
let blogModel= require('../Model/blogModel')

let createBlog = async function(req,res)
{
   try{
    let data = req.body;
    let newBlogObject= await blogModel.create(data)
    res.status(201).send({status:true, data:newBlogObject})
   }catch(err){
    res.status(500).send({status:false,msg:"Internal problem"})
   } 
}

// delete blog by id

const blogModel = require("../Model/blogModel")


let deleteBlogs = async(req, res) => {
    try{
        let blogId = req.params.blogId;

    let blog = await blogModel.findById(blogId);
      
       if(!blog){
     return  res.status(404).send({status:false ,msg: "id is not found" })
       }

       if(blog.isdeleted === true){
        return  res.status(404).send({status:false ,msg: "blog  is already deleted" })
       }
       let deleteBlog = await blogModel.findByIdAndUpdate({_id:blogId},{isdeleted : true})
       res.status(200).send()
    }catch(error){
        console.log(err)
        res.status(500).send({status:false, msg: err.message})
    }
}

module.exports.deleteBlogs = deleteBlogs
module.exports.createBlog = createBlog
=======
const blogModel = require("../Model/blogModel")



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

module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
const  mongoose = require("mongoose")
//const blogModel = require("../Model/blogModel")

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
  

  module.exports.getBlogs =getBlogs
>>>>>>> 23e995909ed6555e04f4504391053537db2cf4c1
