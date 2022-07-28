const mongoose = require("mongoose")


const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length == 0) return false;
  return true;
};


const isValidRequest = function (data) {
  if (Object.keys(data).length == 0) return false;
  return true;
};

const validName = function (name) {
  return /^[a-zA-Z]{2,30}$/.test(name)
}


const isValidMail = function (v) {
  return /^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(v);
};

const isValidMobile = function (num) {
  return /^[6789]\d{9}$/.test(num);
};



const isValidStreet = function (street) {
  return /^([a-zA-Z0-9 ]{2,50})*$/.test(street)
}

const isValidCity = function (city) {
  return /^[a-zA-z]+([\s][a-zA-Z]+)*$/.test(city)
}

const isValidPin = function (pincode) {
  return /^\d{6}$/.test(pincode)
}

const removeExtraSpace = function (value) {
  const res = value.split(" ").filter(word => word).join(" ")
  return res
}

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidSize = function (size) {
  
  let flag=0
  for (x in size) {
    let ret= ["S", "XS", "M", "X", "L", "XXL", "XL" ].indexOf(size[x]) != -1
    if(!ret){
      flag=1
      break
    }}
    if(flag==1)return false
    else return true
}


   
    
    
  const isValidPassword = function (password){
    if(password.length>=8 && password.length<=15){
      return true
    }
    return false
  }
 

const isFloat = function (n) {
  return Number(n) === n && n % 1 !== 0;
}

module.exports = {
  isValid, validName, isValidMail, isValidRequest,
  isValidMobile, isValidPassword, isValidStreet, isValidCity, isValidPin, isValidObjectId, removeExtraSpace,
  isValidSize, isValidSize, isFloat
}