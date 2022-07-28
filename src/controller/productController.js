const productModel = require("../models/productModel")

const getProduct = async function (req, res) {
    try {
        let data = req.query
        // let { size, name, price, priceSort } = data
        let filter = { isDeleted: false }
        if (Object.keys(data).length == 0) {
            let allProducts = await productModel.find(filter)
            if (allProducts.length > 0) {
                return res.status(200).send({ status: true, data: allProducts })
            } else {
                return res.status(404).send({ status: false, msg: "No product found." })
            }
        } else {
            // if(data.size){
            //     data.size = {$in: data.size.split(",")}
            // }
            filter["$or"] = [
                { availableSizes: data.size },
                { title: data.name }
                // { priceGreaterThan: price.priceGreaterThan },
                // { priceLessThan: price.priceLessThan }
            ]
            const productByFilter = await productModel.find(filter)
            if(productByFilter.length == 0){
                return res.status(404).send({status: true, msg: "No product found"})
            }
            return res.status(200).send({status: false, data: productByFilter})

            // if (priceSort == 1) {
                // const productByFilter = await productModel.find(filter)//.sort({ price: 1 })
                // if (productByFilter.length == 0) {
                    // return res.status(404).send({ status: false, msg: "No product found" })
                // }
                // return res.status(200).send({ status: false, data: productByFilter })
            }
            // if (priceSort == -1) {
            //     const productByFilter = await productModel.find(filter).sort({ price: -1 })
            //     if (productByFilter.length == 0) {
            //         return res.status(404).send({ status: false, msg: "No product found" })
            //     }
            //     return res.status(200).send({ status: false, data: productByFilter })
            // }
        // }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { getProduct }
