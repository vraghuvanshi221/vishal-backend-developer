const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
 
    userId: {type:ObjectId, refs:"User",required:true, unique:true},
    items: [{
      productId: {type:ObjectId,refs:"Product", required:true},
      quantity: {type:Number, require:true, min:1}
    }],
    totalPrice: {type:Number, required:true, comment: "Holds total price of all the items in the cart"},
    totalItems: {type:Number, required:true, comment: "Holds total number of items in the cart"},



    
}, { timestamps: true })


module.exports=mongoose.model('Cart',cartSchema)