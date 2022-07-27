const productModel = require("../models/productModel");
const { isValid } = require("../validator/validation");
let ObjectId = require('mongoose').Types.ObjectId





const updateProductDetails = async function (req, res) {
    try {

        let productId = req.params.productId
        if (!ObjectId.isValid(productId)) return res.status(400).send({ status: false, msg: "Please provide a valid productId" });

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: 400, msg: "Enter data in body" });

        const productData = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!productData) return res.status(404).send({ status: false, msg: "Data not found" });

        const { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = data;
        let obj = {}

        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, msg: "don't leave title attribute" })

            const uniqueTitle = await productModel.findOne({ title: title });
            if (uniqueTitle) {
                return res.status(400).send({ status: false, message: "Title Allready Exist Use different Title" });
            }
            obj.title = title;
        };

        if (description) {
            if (!isValid(description)) return res.status(400).send({ status: false, msg: "Enter description" });
            obj.description = description
        };
        if (price) {
            if (!isValid(price)) return res.status(400).send({ status: false, msg: "Enter price" });
            obj.price = price
        };
        if (currencyId) {
            if (!isValid(currencyId)) return res.status(400).send({ status: false, msg: "Enter currencyId" });
            obj.currencyId = currencyId
        };
        if (currencyFormat) {
            if (!isValid(currencyFormat)) return res.status(400).send({ status: false, msg: "Enter currencyFormat" });
            obj.currencyFormat = currencyFormat
        };
        if (isFreeShipping) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, msg: "Enter isFreeShipping" });
            obj.isFreeShipping = isFreeShipping
        };

        if (style) {
            if (!isValid(style)) return res.status(400).send({ status: false, msg: "Enter style" });
            obj.style = style
        };
        if (availableSizes) {
            if (!isValid(availableSizes)) return res.status(400).send({ status: false, msg: "Enter availableSizes" });
            obj.availableSizes = availableSizes
        };
        if (installments) {
            if (!isValid(installments)) return res.status(400).send({ status: false, msg: "Enter installments" });
            obj.installments = installments
        };

        let files = req.files
        if (productImage) {
            if (files) {
                if (files && files.length > 0) {
                    let uploadedFileURL = await uploadFile(files[0])
                    obj.productImage = uploadedFileURL
                }
                else {
                    return res.status(400).send({ msg: "No file found" })
                }
            }
        };

        const updateProduct = await productModel.findByIdAndUpdate({ productId }, { $set: obj }, { new: true })

        return res.status(200).send({ status: true, message: "Successfully update", data: updateProduct })

    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })
    }
};




module.exports = { updateProductDetails };
