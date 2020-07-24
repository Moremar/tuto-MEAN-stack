const express = require('express');

// Mongoose models for MongoDB collections
const Post = require('../models/post');

/*
 * All REST API routes for the /api/posts section
 *
 * We create a "router" and define all the routes, then in app.js we add this router as a middleware.
 * The "/api/posts/" prefix is given in app.js when registering the router, so it does not need
 * to be provided again in each route in this file
 */

const router = express.Router();

// middleware to get all posts
router.get('/',
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


// middleware to get a single post
router.get('/:id',
    (request, response, _next) => {
        const postId = request.params.id;
        console.log('Middleware: GET /api/posts/' + postId);
        // get the post from MongoDB
        Post.findOne({ _id: postId })
            .then( (post) => {
                response.status(200).json({
                    message: 'Retrieved post successfully.',
                    post: post
                });
            });
    }
);


// middleware for the post creation
router.post('/',
    (request, response, _next) => {
        console.log('Middleware: POST /api/posts');
        console.log(request.body);
        const post = new Post({
            title: request.body.title,
            content: request.body.content
        });
        console.log('Creating post in MongoDB post :' + post);
        // save in MongoDB in the current database in collection called "posts" (lower-case plurial name of the model)
        post.save()
            .then( (createdPost) => {
                // send the response containing the posts
                response.status(200).json({
                    message: 'Created post successfully.',
                    post: createdPost
                });
            });
    }
);


// middleware to edit a post
router.put('/:id',
    (request, response, _next) => {
        const postId = request.params.id;
        console.log('Middleware: PUT /api/posts/' + postId);
        console.log(request.body);
        // update a post in MongoDB
        Post.findByIdAndUpdate({_id: postId}, {
                title: request.body.title,
                content: request.body.content
            })
            .then( (updatedPost) => {
                response.status(200).json({
                    message: 'Updated post successfully.',
                    post: updatedPost
                });
            });
    }
);


// middleware to delete a post
router.delete('/:id',
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

// export the router containing all routes handlers for /api/posts section
module.exports = router;