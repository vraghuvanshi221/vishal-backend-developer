
const mongoose = require('mongoose');
const validate=require('validator');
const { default: isEmail } = require("validator/lib/isEmail");

const authorSchema = new mongoose.Schema({
 fName: {
    type:String,
     require:true},

 lName: {
    type:String,
    require:true
 },

 title: {
    type:String,
    require:true,
     enum:["Mr", "Mrs", "Miss"]
   },

 email: {
    type:String,
   require:true,
    validate:[isEmail,'invalid email'],
    unique:true,
},

 password:{
    type:String,
    require:true
 }
},{timestamps: true})

 module.exports = mongoose.model('author-project', authorSchema) 