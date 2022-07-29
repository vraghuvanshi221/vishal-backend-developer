const productModel = require("../models/productModel")
const { isValid,
    isValidRequest,
    isValidObjectId,
    removeExtraSpace,
    isValidSize,
    isInt,
    validName,
    isValidNumberInt, isValidNumber } = require("../validator/validation")
const { uploadFile } = require("../AWS/aws")


//==============================================createProduct==============================================//

const createProduct = async function (req, res) {
    try {
        const files = req.files

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "Invalid Request" })
        }
        // const data = JSON.parse(req.body.data)
        let data = req.body
        //extracting params form request body
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data

        let newProductDetail = {}

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }
        title = removeExtraSpace(title)
        let isTitleAlreadyExist = await productModel.findOne({ title: title, isDeleted: false })
        if (isTitleAlreadyExist) {
            return res.status(409).send({ status: false, message: "product  with this title already exist" })
        }
        newProductDetail.title = title

        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "description is required" })
        }
        newProductDetail.description = description

        if (!(isValid(price) && isValidNumber(price))) {
            return res.status(400).send({ status: false, message: "price is mandatory and should be a valid number" })
        }
        newProductDetail.price = price

        if (isValid(currencyId)) {
            if (currencyId != "INR") {
                return res.status(400).send({ status: false, message: "currency Id should be INR" })
            }
        }
        else {
            currencyId = "INR"
        }
        newProductDetail.currencyId = currencyId

        if (isValid(currencyFormat)) {
            if (currencyFormat != '₹') {
                return res.status(400).send({ status: false, message: "currency Format should be '₹'" })
            }
        }
        else {
            currencyFormat = "₹"
        }
        newProductDetail.currencyFormat = currencyFormat

        if (isFreeShipping) {
            if (!(isFreeShipping == 'true' || isFreeShipping == 'false')) {
                return res.status(400).send({ status: false, message: "isFreeShipping can be either 'true' or 'false'" })
            }
            else
                newProductDetail.isFreeShipping = isFreeShipping
        }

        if (style) {
            if (!isValid(style)) {
                return res.status(400).send({ status: false, message: "please send some value is style" })
            }
            else
                newProductDetail.style = removeExtraSpace(style)
        }

        if (availableSizes) {
            availableSizes = availableSizes.split(",")
            if (!isValidSize(availableSizes)) {
                return res.status(400).send({ status: false, message: "sizes should be among [S, XS , M , X, L, XXL,X]" })
            }
            newProductDetail.availableSizes = availableSizes
        }


        if (isValid(installments)) {

            if (!isValidNumberInt(installments)) {
                return res.status(400).send({ status: false, message: "please send some valid value in installments" })
            }
            newProductDetail.installments = installments
        }


        //uploading Product Image
        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            newProductDetail.productImage = uploadedFileURL
        }
        else {
            return res.status(400).send({ status: false, message: "product image file is required" })
        }

        const newProduct = await productModel.create(newProductDetail)
        res.status(201).send({ status: true, message: "Product created successfully", data: newProduct })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
};


// ************************** Get product by filter *************************


const getProduct = async function (req, res) {
    try {
        let data = req.query
        let filter = { isDeleted: false }

        if (data.name) {
            if (!isValid(data.name)) {
                return res.status(400).send({ status: false, message: "Invalid input of name" })
            }
            filter.title ={'$regex':data.name}
        }

        if (data.size) {
            data.size = data.size.toUpperCase()
            data.size = data.size.split(",")
            if (!isValid(data.size)) {
                return res.status(400).send({ status: false, message: "Invalid input of size" })
            }
            data.size = data.size.split(",")
            if (!isValidSize(data.size)) {
                return res.status(400).send({ status: false, message: "sizes should be among [S, XS , M , X, L, XXL,X]" })
            }

            filter.availableSizes = {'$in': data.size}
        }

        if (data.priceGreaterThan && data.priceLessThan) {
            if (!(isValid(data.priceGreaterThan) && isValidNumber(data.priceGreaterThan))) {
                return res.status(400).send({ status: false, message: "price greatr than value should be a numeric value" })
            }
            if (!(isValid(data.priceLessThan) && isValidNumber(data.priceLessThan))) {
                return res.status(400).send({ status: false, message: "price less than value should be a numeric value" })
            }
            filter.price = { '$gt': data.priceGreaterThan, '$lt': data.priceLessThan }
        }

        else if (data.priceGreaterThan) {
            if (!(isValid(data.priceGreaterThan) && isValidNumber(data.priceGreaterThan))) {
                return res.status(400).send({ status: false, message: "price greatr than value should be a numeric value" })
            }
            filter.price = { '$gt': data.priceGreaterThan }
        }

        else if (data.priceLessThan) {
            if (!(isValid(data.priceLessThan) && isValidNumber(data.priceLessThan))) {
                return res.status(400).send({ status: false, message: "price less than value should be a numeric value" })
            }
            filter.price = { '$lt': data.priceLessThan }
        }

        if (data.priceSort) {
            priceSort = data.priceSort
        } else {
            priceSort = 1
        }

        const product = await productModel.find(filter).sort({ price: priceSort });

        if (product.length > 0) {
            return res.status(200).send({ status: true, message: "Success", data: product })
        }
        else
            return res.status(404).send({ status: false, message: "No data found" })

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, Error: err.message });
    }
}



// *************************** Get product by Id **************************

const getProductsById = async function (req, res) {
    try {
        let productId = req.params.productId;

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: 'Please provide valid productId' })
        }

        const product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (product == null) return res.status(404).send({ status: false, message: "No product found" })

        return res.status(200).send({ status: true, message: 'Success', data: product })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}



// ************************** Update product by Id *************************




const updateProductDetails = async function (req, res) {
    try {

        let productId = req.params.productId
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, msg: "Please provide a valid productId" });

        const productData = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!productData) return res.status(404).send({ status: false, msg: "Data not found" });
        let data = req.body
        let files = req.files

        if ((Object.keys(data).length == 0) && (!isValid(files))) {
            return res.status(400).send({ status: 400, msg: "Invalid request" });
        }
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = data;
        let obj = {}

        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, msg: "don't leave title attribute empty" })

            const uniqueTitle = await productModel.findOne({ title: title, isDeleted: false });
            if (uniqueTitle) {
                return res.status(400).send({ status: false, message: "Title Already Exist Use different Title" });
            }
            obj.title = title;
        };

        if (description) {
            if (!isValid(description)) return res.status(400).send({ status: false, msg: "Enter description" });
            obj.description = description
        };
        if (price) {
            if (!isValid(price) && isNaN(Number(price))) return res.status(400).send({ status: false, msg: "Enter valid no in price" });
            obj.price = price
        };
        if (currencyId) {
            if (!isValid(currencyId)) return res.status(400).send({ status: false, msg: "Enter currencyId" });

            if (currencyId != "INR") {
                return res.status(400).send({ status: false, message: "currency Id should be INR" })
            }
        }
        else {
            obj.currencyId = currencyId
        };
        if (currencyFormat) {
            if (!isValid(currencyFormat)) return res.status(400).send({ status: false, msg: "Enter currencyFormat" });
            if (currencyFormat != '₹') {
                return res.status(400).send({ status: false, message: "currency Format should be '₹'" })
            }
            else {
                obj.currencyFormat = currencyFormat
            }

        };

        if (isFreeShipping) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, msg: "Enter isFreeShipping" });
            if (!(isFreeShipping == 'true' || isFreeShipping == 'false')) {
                return res.status(400).send({ status: false, message: "isFreeShipping can be either 'true' or 'false'" })
            }
            obj.isFreeShipping = isFreeShipping
        };

        if (style) {
            if (!isValid(style)) return res.status(400).send({ status: false, msg: "Enter style" });
            obj.style = style
        };
        if (availableSizes) {
            if (!isValid(availableSizes))
                return res.status(400).send({ status: false, msg: "Enter availableSizes" });
            availableSizes = availableSizes.split(",")
            if (!isValidSize(availableSizes)) {
                return res.status(400).send({ status: false, message: "sizes should be among [S, XS , M , X, L, XXL,X]" })
            }
            obj.availableSizes = availableSizes
        };
        if (installments) {
            if (isNaN(Number(installments)) || (!isInt(installments)))
                return res.status(400).send({ status: false, msg: "Enter valid number in installments" });
            obj.installments = installments
        };

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            obj.productImage = uploadedFileURL
        }


        const updateProduct = await productModel.findByIdAndUpdate({ _id: productId }, { $set: obj }, { new: true })

        return res.status(200).send({ status: true, message: "Successfully update", data: updateProduct })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};




// ************************** Delete product by Id *************************

const deleteProductById = async function (req, res) {

    try {

        let id = req.params.productId;
        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "product Id is invalid." });
        }

        let findProduct = await productModel.findOne({ _id: id });

        if (findProduct == null) {
            return res.status(404).send({ status: false, msg: "No such Product found" });
        }
        if (findProduct.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "Product is already deleted" });
        }
        if (findProduct.isDeleted == false) {
            let Update = await productModel.findOneAndUpdate(
                { _id: id },
                { isDeleted: true, deletedAt: Date() },
                { new: true }
            );
            return res.status(200).send({ status: true, message: "successfully deleted the product", data: Update });
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, Error: err.message });
    }
}





module.exports = { createProduct, getProduct, getProductsById, deleteProductById, updateProductDetails, getProduct }