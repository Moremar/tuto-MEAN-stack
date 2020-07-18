// Node built-in packages
const http = require('http');


// create the server
const server = http.createServer(
    (request, response) => {
        response.end('Response from Node app');
    }
);

// start the server on 3000 by default (for dev phase) or on port specified in the config
server.listen(process.env.PORT || 3000);