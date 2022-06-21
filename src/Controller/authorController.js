const authorModel = require("../Model/authorModel")




// ---------------------***----------createAuthor--------------***------------------

const createAuthor = async(req, res) => {
    try{
        let data = red.body
        if(!data)
        {
            res.status(400).send({status:true, msg:"Data is required"})
        }
        let created = await authorModel.create(data)
        res.status(201).send({status: true, data:created})


    }catch(err){
        console.log(err)
        res.status(500).send({status:false, msg: err.message})
    }
}





module.exports.createAuthor = createAuthor;
