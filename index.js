/*
*Primary file for the API
*/


//Dependencies

const http = require("http")
const url = require("url")
const StringDecoder = require("string_decoder").StringDecoder;
//the server should respond to all requests
const server = http.createServer((req, res) => {
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
        res.end('Hello, World\n')
        //log path
        console.log(`Request received with this payload ${buffer}`)
    })


})


//start the server and have it listen to port 3000

server.listen(3000, () => {
    console.log("Server is listening on port 3000")
})