// Packages from NPM
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// Mongoose models for MongoDB collections
const Post = require('./models/post');

// Connect to MongoDB
const mongoUser = 'admin';
const mongoPwd = '2CdjMdbZ6pchCAp';
const mongoServer = 'cluster0.qsaef.mongodb.net';
const dbName = 'mean-app';
mongoose.connect('mongodb+srv://' + mongoUser + ':' + mongoPwd + '@' + mongoServer + '/' + dbName)
        .then(() => {
            console.log("Connection to MongoDB succeeded.")
        }).catch(() => {
            console.log("Connection issue !");
        });

// create the express app
const app = express();

/*
 * Express middleware can be called with :
 *  - app.use()  to apply it for every verb
 *  - app.get() / app.post() ... to apply only for a specific verb
 * All these functions can take a URL as 1st argument to only apply for this URL
 * 
 * Express applies the middleware in the order they are defined.
 * From one middleware, call next() to jump to the next middleware.
 * If a middleware handles the query then it does not call next() but sends a response.
 */


// Express middleware to parse the POST/PUT requests body and make it available under request.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// first custom middleware to apply some common headers
app.use((_request, response, next) => {
    console.log('Middleware: Init');
    // All responses will be on JSON format
    response.setHeader('Content-Type', 'application/json');
    // CORS header to allow Cross Origin Resource Sharing
    response.setHeader('Access-Control-Allow-Origin', '*');
    // need to allow OPTIONS that is implicitely sent by Angular to check POST validity
    response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type, ' + 
                                                       'Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Origin');
    // jump to the next middleware
    next();
});


// define a middleware for post list
app.get('/api/posts',
    (_request, response, _next) => {
        console.log('Middleware: GET /api/posts');
        // get all posts from MongoDB
        Post.find()
            .then( (posts) => {
                response.status(200).json({
                    message: 'Retrieved posts successfully.',
                    posts: posts
                });
            });
    }
);


// add a middleware for the post creation
app.post('/api/posts',
    (request, response, _next) => {
        console.log('Middleware: POST /api/posts');
        console.log(request.body);
        const post = new Post({
            title: request.body.title,
            content: request.body.content
        });
        console.log('Creating post in MongoDB post :' + post);
        // save in MongoDB in the current database in collection called "posts" (lower-case plurial name of the model)
        post.save();
//        posts.push(post);
        // send the response containing the posts
        // no call to next() since the processing is finished here, no other middleware needs to be applied
        response.status(200).json({
            message: 'Created post successfully.',
            post: post
        });
    }
);


// define a middleware for post deletion
app.delete('/api/posts/:id',
    (request, response, _next) => {
        const postId = request.params.id;
        console.log('Middleware: DELETE /api/posts/' + postId);
        // delete a post in MongoDB
        Post.deleteOne({ _id: postId })
            .then( (_deletionResult) => {
                response.status(200).json({
                    message: 'Deleted post successfully.',
                    id: postId
                });
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
