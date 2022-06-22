
const authorModel = require("../Model/authorModel")
// ---------------------***----------createAuthor--------------***------------------//


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


// handle 400 error 
const createAuthor = async (req, res) => {
    try {
        let data = req.body
        // if(!isValid(data.fname))
        // {
        //     return res.status(400).send({status:false, msg:"invalid fname"})
        // } 
        // if(data.fname==undefined) return res.status(400).send({})
        // if(data.lname==undefined) return res.status(400).send({})
        // if(data.email==undefined)
        // {
        //    return res.status(400).send({})
        // }
        // if(data.password==undefined)
        // {
        //    return res.status(400).send({})
        // }
        // console.log(typeof(data.title))
        // console.log(typeof("Mr"))
        // let mytitle=data.title
       
        // if(mytitle!= "Mr" || mytitle!='Mrs'|| mytitle!='Miss') return res.send("invalid title")
        

        let arrKeys = Object.keys(data); 
        if (arrKeys.length == 0) return res.status(400).send({ status: false, msg: "Data is required" })

        let created = await authorModel.create(data) 
        res.status(201).send({ status: true, data: created })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createAuthor = createAuthor;
