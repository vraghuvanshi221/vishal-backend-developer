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