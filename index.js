/*
 * Primary file for API
 *
 */

// Dependencies
const server = require("./lib/server");
const workers = require("./lib/workers")

// Declare the app
const app = {};

//Init function
app.init = function(){
  //start the server
  server.init()
  //start the workers
  workers.init()
};

// Execute that function
app.init();

//Export the app

module.exports = app;