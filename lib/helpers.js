/*
*File to help with various tasks
*/

//dependencies
const crypto = require("crypto")
const config = require("../config")
//container for all of the helpers
const helpers = {}

//create a SHA256 hash

helpers.hash = function(str){
    if(typeof(str) === "string" && str.length){
        const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
        return hash
    }
}

//Parse a JSON string to object w/o throwing errors

helpers.parseJsonToObject = function(str){
    try{
        return JSON.parse(str)
    } catch(e){
        return {};
    }
}


//export the container

module.exports = helpers