/*
*Primary file for the API
*/


//Dependencies

const http = require("http");
const https = require("https")
const url = require("url")
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs")
const _data = require('./lib/data')
const handlers = require("./lib/handlers")
const helpers = require("./lib/helpers")



//the server should respond to all requests
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res)
})


//Instantiating the HTTP server

httpServer.listen(config.httpPort, () => {
    console.log("Server is listening on port " + config.httpPort + " Environment: " + config.envName + " mode")
})

//instantiate https server
const httpsServerOptions = {
    key:fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions,(req, res) => {
    unifiedServer(req, res)
})
//start the https server
httpsServer.listen(config.httpsPort, () => {
    console.log("Server is listening on port " + config.httpsPort + " Environment: " + config.envName + " mode")

})
//all the server logic for http and https
const unifiedServer = (req, res) => {
    //get url and parse it
    const parsedUrl = url.parse(req.url, true);
    //get path from url
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g,'')

    //get the query string as an object
    const queryStringObject = parsedUrl.query;


    //get the http method
    const method = req.method.toLowerCase()

    //get the headers as an object
    const headers = req.headers


    //get the payload if there is any
    const decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })

    req.on('end', () => {
        buffer += decoder.end()
        //send response

        //choose handler request should go to, if not found use not found
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //construc the data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: helpers.parseJsonToObject(buffer)
        }

        //route the request to the handler specified in the router

        chosenHandler(data, function(statusCode, payload){
            //use the status code called back by the handler, or defaultto 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            //use the payload called back by the handler, or default to an empty objec
            payload = typeof(payload) === 'object' ? payload: {}

            const payloadString = JSON.stringify(payload)

            //return response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)
            console.log(`Returning this request`, statusCode, payloadString)
    })
})
}

//define a router

const router = {
    ping: handlers.ping,
    users: handlers.users
}