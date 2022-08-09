const productModel = require("../models/productModel")
const { isValid,
    isValidRequest,
    isValidObjectId,
    removeExtraSpace,
    isValidSize,
    validName,
    isValidNumberInt, isValidNumber,isValidImage } = require("../validator/validation")
const { uploadFile } = require("../AWS/aws")


//==============================================createProduct==============================================//

const createProduct = async function (req, res) {
    try {
       
        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "Please enter details for product listing." })
        }
        const files = req.files

        let productDetails = req.body
        // const data = JSON.parse(req.body.data)
        //extracting params form request body
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = productDetails

        let newProductDetail = {}

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }
        if (!isNaN(title)) {
            return res.status(400).send({ status: false, message: "Title can't be a numeric value." })
        }
        title = removeExtraSpace(title)
        let isTitleAlreadyExist = await productModel.findOne({ title: title, isDeleted: false })
        if (isTitleAlreadyExist) {
            return res.status(409).send({ status: false, message: "Product with this title already exists, try new." })
        }
        newProductDetail.title = title

        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "Description is required." })
        }
        newProductDetail.description = description

        if (!(isValid(price) && isValidNumber(price)&&price>0)) {
            return res.status(400).send({ status: false, message: "Price is mandatory and it should be a valid number." })
        }
        newProductDetail.price = price

        if (currencyId) {
            if (!isValid(currencyId)) {
                return res.status(400).send({ status: false, message: "Currency Id is invalid." })
            }

            if (currencyId != "INR") {
                return res.status(400).send({ status: false, message: "Currency Id should be INR only." })
            }
        }
        else {
            currencyId = "INR"
        }
        newProductDetail.currencyId = currencyId

        if (currencyFormat) {
            if (!isValid(currencyFormat)) {
                return res.status(400).send({ status: false, message: "Currency format is invalid." })
            }

            if (currencyFormat != '₹') {
                return res.status(400).send({ status: false, message: "Currency Format should be '₹' only." })
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
                return res.status(400).send({ status: false, message: "Please send some value is style." })
            }
            else
                newProductDetail.style = removeExtraSpace(style)
        }

        if (availableSizes) {
            availableSizes = availableSizes.toUpperCase()
            availableSizes = availableSizes.split(",")
            for (let i in availableSizes) {
                availableSizes[i] = availableSizes[i].trim()
            }
            if (!isValidSize(availableSizes)) {
                return res.status(400).send({ status: false, message: "Sizes should be among [XS, S, M, L, XL, XXL]" })
            }
            newProductDetail.availableSizes = availableSizes
        }


        if (isValid(installments)) {

            if (!isValidNumberInt(installments)&&installments>0) {
                return res.status(400).send({ status: false, message: "Number of installments should be a complete figure." })
            }
            newProductDetail.installments = installments
        }



        //uploading Product Image
        
        if (files && files.length > 0) {
            if(!isValidImage(files[0].mimetype)){
                 return res.status(400).send({ status: false, message: "file should be an image file" }) 
            }
            let uploadedFileURL = await uploadFile(files[0])
            newProductDetail.productImage = uploadedFileURL
        }
        else {
            return res.status(400).send({ status: false, message: "product image file is required" })
        }

        const newProduct = await productModel.create(newProductDetail)
        res.status(201).send({ status: true, message: "Product creation has a successful", data: newProduct })

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
                return res.status(400).send({ status: false, message: "Please enter valid name for filter." })
            }
            filter.title = { '$regex': data.name, "$options": "$i" }

        }

        if (data.size) {
            data.size = data.size.toUpperCase()
            for (let i in data.size) {
                data.size[i] = data.size[i].trim()
            }
            data.size = data.size.split(",")

            if (!isValidSize(data.size)) {
                return res.status(400).send({ status: false, message: "Sizes should be among [XS,X, S, M, L, XL, XXL]" })
            }

            filter.availableSizes = { '$in': data.size }
        }

        if (data.priceGreaterThan && data.priceLessThan) {
            if (!(isValid(data.priceGreaterThan) && isValidNumber(data.priceGreaterThan))) {
                return res.status(400).send({ status: false, message: "Price filter should be a numeric value." })
            }
            if (!(isValid(data.priceLessThan) && isValidNumber(data.priceLessThan))) {
                return res.status(400).send({ status: false, message: "Price filter should be a numeric value." })
            }
            filter.price = { '$gt': data.priceGreaterThan, '$lt': data.priceLessThan }
        }

        else if (data.priceGreaterThan) {
            if (!(isValid(data.priceGreaterThan) && isValidNumber(data.priceGreaterThan))) {
                return res.status(400).send({ status: false, message: "Price filter should be a numeric value." })
            }
            filter.price = { '$gt': data.priceGreaterThan }
        }

        else if (data.priceLessThan) {
            if (!(isValid(data.priceLessThan) && isValidNumber(data.priceLessThan))) {
                return res.status(400).send({ status: false, message: "Price filter should be a numeric value." })
            }
            filter.price = { '$lt': data.priceLessThan }
        }
        
        let priceSort=1
        if (data.priceSort) {
          
            if(!(data.priceSort==1||data.priceSort==-1)){
                return res.status(400).send({ status: false, message: "value of price sort can be 1(ascending) or -1(descending)" })     
            }
            priceSort = data.priceSort
        } 

        const product = await productModel.find(filter).sort({ price: priceSort });

        if (product.length > 0) {
            return res.status(200).send({ status: true, message: "Success", data: product })
        }
        else
            return res.status(404).send({ status: false, message: "No product found." })

    }
    catch (err) {
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
        if (!productData) return res.status(404).send({ status: false, msg: "Product not found" });
        let data = req.body
        let files = req.files

        if ((Object.keys(data).length == 0) && (req.files == undefined)) {
            return res.status(400).send({ status: false, msg: "Please enter product details for updation." });
        }
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data;
        let obj = {}

        if (title) {
            if (!isNaN(title)) return res.status(400).send({ status: false, msg: "Title can't be a numeric value." })

            const uniqueTitle = await productModel.findOne({ title: title, isDeleted: false });
            if (uniqueTitle) {
                return res.status(400).send({ status: false, message: "Title Already Exist Use different Title" });
            }
            obj.title = title;
        };

        if (description) {
            if (!isNaN(description)) return res.status(400).send({ status: false, msg: "Description can't be numbers only, add some word as well." });
            obj.description = description
        };
        if (price) {
            if (!(isValid(price) && isValidNumber(price)&&price>0)) return res.status(400).send({ status: false, msg: "Enter valid no in price" });
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
            availableSizes = availableSizes.toUpperCase()
            availableSizes = availableSizes.split(",")
            for (let i in availableSizes) {
                availableSizes[i] = availableSizes[i].trim()
            }
            if (!isValidSize(availableSizes)) {
                return res.status(400).send({ status: false, message: "Sizes should be among [XS, S, M, L, XL, XXL]" })
            }
            obj.availableSizes = availableSizes
        };
        if (installments) {
            if (!(isValid(installments) && isValidNumberInt(installments)&&installments>0))
                return res.status(400).send({ status: false, msg: "Enter valid number in installments" });
            obj["$push"] = { installments: installments }
        };

        if (files && files.length > 0) {
            if(!isValidImage(files[0].mimetype)){
                return res.status(400).send({ status: false, message: "file should be an image file" }) 
           }
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
            return res.status(200).send({ status: true, message: "successfully deleted the product" });
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, Error: err.message });
    }
}





module.exports = { createProduct, getProduct, getProductsById, deleteProductById, updateProductDetails, getProduct }