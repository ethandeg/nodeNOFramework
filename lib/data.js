/*
 * Library for storing and editing data
 *
 */

// Dependencies
var fs = require('fs');
var path = require('path');
const helpers = require("./helpers")

// Container for module (to be exported)
var lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// Write data to a file
lib.create = function(dir,file,data,callback){
  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist');
    }
  });

};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
        if(!err && data){
            const parseData = helpers.parseJsonToObject(data)
            callback(false, parseData)
        } else {
            callback(err,data)
        }
        callback(err,data)
    });
};

lib.update = function(dir, file, data, callback){
    //open the file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            const stringData = JSON.stringify(data)
            //truncate the file
            fs.ftruncate(fileDescriptor, (err) => {
                if(!err){
                    //write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if(!err){
                            fs.close(fileDescriptor, (err) => {
                                if(!err){
                                    callback(false)
                                } else {
                                    callback("Error closing the file")
                                }
                            })
                        } else {
                            callback("Error writing to existing file")
                        }
                    })
                } else {
                    callback("Error truncating file")
                }
            })
        } else {
            callback("Could not open the file for updating, it may not exist yet")
        }
    })
}

lib.delete = (dir, file, callback) => {
    //unlink the file
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
        if(!err){
            callback(false)
        } else {
            callback("Trouble deleting file", err)
        }
    })
}


module.exports = lib;