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