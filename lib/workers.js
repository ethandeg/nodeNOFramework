/*
*Worker related tasks
*/

//Dependencies
const path = require("path");
const fs = require("fs");
const _data = require('./data');
const https = require("https");
const http = require("http");
const helpers = require("./helpers");

//Instantiate the worker object
const workers = {};

//lookup all checks, get their data, send to validator
workers.gatherAllChecks = function() {
    //get all of the checks in the system
    _data.list("checks", (err, checks) => {
        if(!err && checks && checks.length > 0){
            checks.forEach(check => {
                //read in the check data
                _data.read('checks', check, (err, originalCheckData) => {
                    if(!err && originalCheckData){
                        //Pass it to the check validator and let that function continue or log errors as needed
                        workers.validateCheckData(originalCheckData)
                    } else {
                        console.log("Error reading one of the checks data")
                    }
                })
            })
        } else {
            console.log("Error: could not find any checks to process")
        }
    })
}

//Sanity checking the check data

workers.validateCheckData = (originalCheckData) => {
    originalCheckData = typeof(originalCheckData) === 'object' && originalCheckData !== null ? originalCheckData : {};
    originalCheckData.id = typeof(originalCheckData.id) === 'string' && originalCheckData.id.trim().length === 20 ? originalCheckData.id : false;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) === 'string' && originalCheckData.userPhone.trim().length === 20 ? originalCheckData.userPhone : false;
    originalCheckData.protocol = typeof(originalCheckData.protocol) === 'string' && ['http', 'https'].includes(originalCheckData.protocol.trim()) ? originalCheckData.protocol : false;
    originalCheckData.url = typeof(originalCheckData.url) === 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url : false;
    originalCheckData.method = typeof(originalCheckData.method) === 'string' && ['post', 'get', 'put', 'delete'].includes(originalCheckData.method.trim()) ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) === 'string' && ['post', 'get', 'put', 'delete'].includes(originalCheckData.successCodes.trim()) ? originalCheckData.successCodes : false;


}

//Timer to execute the worker process once per minute
workers.loop = function(){
    setInterval(function() {
        workers.gatherAllChecks();
    }, 1000 * 60);
};

// Init script
workers.init = function(){
    //Execute all checks immediately
    workers.gatherAllChecks();
    //Callthe loop so the checks will execute later on
    workers.loop();
}

//export module

module.exports = workers;