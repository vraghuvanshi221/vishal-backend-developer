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