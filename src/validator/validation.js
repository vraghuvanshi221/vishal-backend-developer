const mongoose=require("mongoose")

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length == 0) return false;
     return true;
  };

  
  const isValidRequest = function (data) {
    if (Object.keys(data).length == 0) return false;
    return true;
  };
  
  const isValidMail = function (v) {
    return /^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(v);
  };
  
  const isValidMobile = function (num) {
    return /^[6789]\d{9}$/.test(num);
  };


  module.exports={isValid,isValidMail,isValidRequest,isValidMobile}