// Packages from NPM
const express = require('express');
const bodyParser = require("body-parser");


// create the express app
const app = express();

// for now use an in-memory array of posts (will go to MongoDB later)
posts = [
    {id: '1', title: 'post1', content: 'My post1 content'},
    {id: '2', title: 'post2', content: 'My post2 content'},
];

/*
 * Express middleware can be called with :
 *  - app.use()  to apply it for every verb
 *  - app.get() / app.post() ... to apply only for a specific verb
 * All these functions can take a URL as 1st argument to only apply for this URL
 */


// Express middleware to parse the POST/PUT requests body and make it available under request.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((_request, response, next) => {
    console.log('Middleware: Init');
    // Add common headers for all requests
    response.setHeader('Content-Type', 'application/json');
    // CORS header to allow Cross Origin Resource Sharing
    response.setHeader('Access-Control-Allow-Origin', '*');
    // need to allow OPTIONS that is implicitely sent by Angular to check POST validity
    response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type, ' + 
                                                       'Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Origin');
    // apply next middleware
    next();
});


// add a middleware for the /api/posts path
app.get('/api/posts',
    (_request, response, _next) => {
        console.log('Middleware: GET /api/posts');
        // send the response containing the posts
        // no call to next() since the processing is finished here, no other middleware needs to be applied
        response.status(201).json({
            message: 'Retrieved posts successfully.',
            posts: posts
        });
    }
);


// add a middleware for the /api/posts path
app.post('/api/posts',
    (request, response, _next) => {
        console.log('Middleware: POST /api/posts');
        console.log(request.body);
        // TODO use ID from MongoDB
        const post = {id: '3', title: request.body.title, content: request.body.content};
        console.log('Will create post :');
        console.log(post);
        posts.push(post);
        // send the response containing the posts
        // no call to next() since the processing is finished here, no other middleware needs to be applied
        response.status(200).json({
            message: 'Created post successfully.',
            post: post
        });
    }
);


// Fallback middleware called when no other middleware could handle the request
app.use(
    (_request, response, _next) => {
        console.log('Middleware: Not found');
        // TODO we probably want 404 here but it causes a CORS error (expect ok status)
        response.status(200).json({
            message: 'No handler for this path.'
        });
    }
);

// export the Express app to be used in server.js
module.exports = app;
