const productModel = require("../models/productModel")
const { isValid, 
    isValidRequest, 
    isValidObjectId, 
    removeExtraSpace,
    isValidSize,
    isFloat } = require("../validator/validation")
const { uploadFile } = require("../AWS/aws")



const createProduct = async function (req, res) {
    try {
         const files = req.files

       if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "Invalid Request" })
        }
       // const data = JSON.parse(req.body.data)
        let data=req.body
        //extracting params form request body
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data

        let newProductDetail={}

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }
        title = removeExtraSpace(title)
        let isTitleAlreadyExist = await productModel.findOne({ title: title, isDeleted: false })
        if (isTitleAlreadyExist) {
            return res.status(409).send({ status: false, message: "product  with this title already exist" })
        }
        newProductDetail.title=title

        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "description is required" })
        }
        newProductDetail.description=description

        if (!isValid(price) && isNaN(Number(price))) {
            return res.status(400).send({ status: false, message: "price is mandatory and should be a valid number" })
        }
        newProductDetail.price=price

        if(isValid(currencyId)){
            if(currencyId!="INR"){
                return res.status(400).send({ status: false, message: "currency Id should be INR" })
            }
        }
        else{
            currencyId="INR"
        }
        newProductDetail.currencyId=currencyId
        
        if(isValid(currencyFormat)){
            if(currencyFormat!='₹'){
                return res.status(400).send({ status: false, message: "currency Format should be '₹'" })
            }
        }
        else{
            currencyFormat="₹"
        }
        newProductDetail.currencyFormat=currencyFormat

        if(isFreeShipping){
            if(!(isFreeShipping=='true'||isFreeShipping=='false')){
            return res.status(400).send({ status: false, message: "isFreeShipping can be either 'true' or 'false'" })}
            else
            newProductDetail.isFreeShipping=isFreeShipping
        }
        


        if(style){
         if(!isValid(style)){
            return res.status(400).send({ status: false, message: "please send some value is style" })
            }
         else
        newProductDetail.style=removeExtraSpace(style)
        }

     
       
        
        if(availableSizes){
            availableSizes=availableSizes.split(",")
            if(!isValidSize(availableSizes)){
                return res.status(400).send({ status: false, message: "sizes should be among [S, XS , M , X, L, XXL,X]" })
            }
            newProductDetail.availableSizes=availableSizes
        }

        if(installments){
            if(isNaN(Number(installments)&&isFloat(installments))){
                return res.status(400).send({ status: false, message: "please send some valid value in installments" })
            }
            newProductDetail.installments=installments
        }


        //uploading Product Image
        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            newProductDetail.productImage = uploadedFileURL
        }
        else {
           return res.status(400).send({ status: false, message: "product image file is required" })
        }

        const newProduct=await productModel.create(newProductDetail)
         res.status(201).send({status:true,message: "Product created successfully",data:newProduct})

 }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
};

//------------------------------------------------update product------------------------------------------------------------------------//


const updateProductDetails = async function (req, res) {
    try {

        let productId = req.params.productId
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, msg: "Please provide a valid productId" });

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: 400, msg: "Enter data in body" });

        const productData = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!productData) return res.status(404).send({ status: false, msg: "Data not found" });

        const { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = data;
        let obj = {}

        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, msg: "don't leave title attribute" })

            const uniqueTitle = await productModel.findOne({ title: title ,isDeleted:false});
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
            if (!isValid(price) && isNaN(Number(price))) return res.status(400).send({ status: false, msg: "Enter price" });
            obj.price = price
        };
        if (currencyId) {
            if (!isValid(currencyId)) return res.status(400).send({ status: false, msg: "Enter currencyId" });

            if(currencyId!="INR"){
                return res.status(400).send({ status: false, message: "currency Id should be INR" })
            }
        }
        else{
            currencyId="INR"
            obj.currencyId = currencyId
        };
        if (currencyFormat) {
            if (!isValid(currencyFormat)) return res.status(400).send({ status: false, msg: "Enter currencyFormat" });
            if(currencyFormat!='₹'){
                return res.status(400).send({ status: false, message: "currency Format should be '₹'" })
            } else{
            currencyFormat="₹"
        }
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
            if(!isValidSize(availableSizes)){
                return res.status(400).send({ status: false, message: "sizes should be among [S, XS , M , X, L, XXL,X]" })
            }
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
              return res.status(200).send({status: true,message: "successfully deleted the product",data:Update});
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, Error: err.message });
    }

}





module.exports={createProduct,getProductsById, deleteProductById,updateProductDetails,getProduct}









