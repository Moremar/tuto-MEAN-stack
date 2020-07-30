const express = require('express');
const multer = require('multer');

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

/**
 * configure Multer for file upload
 *
 * Every route that needs to upload file should call Multer before their own handler,
 * using this Multer config.
 */
const MIME_TYPE_MAP = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
};

const multerConfig = multer.diskStorage({
    destination: (_request, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        error = null;
        if (!isValid) {
            // should never happen if the backend validated correctly
            error = new Error('Invalid MIME type');
        }
        folder = 'backend/images'; // relative to server root
        callback(error, folder);
    },
    filename: (_request, file, callback) => {
        const errors = null;
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(errors, name + '-' + Date.now() + extension);
    }
});

// middleware to get all posts
router.get('/',
    (request, response, _next) => {
        console.log('Middleware: GET ' + request.originalUrl);
        const mongoQuery = Post.find();

        // Use query parameters for pagination
        const pageIndex = +request.query.pageIndex;
        const pageSize = +request.query.pageSize;
        if (pageIndex !== undefined && pageSize !== undefined) {
            mongoQuery.skip(pageSize * pageIndex)
                .limit(pageSize);
        }

        // get all posts from MongoDB
        mongoQuery.then(
            (posts) => {
                Post.count().then(
                    (total) => {
                        response.status(200).json({
                            message: 'Retrieved posts successfully.',
                            posts: posts,
                            total: total
                        });
                    }
                );
            }
        );
    }
);


// middleware to get a single post
router.get('/:id',
    (request, response, _next) => {
        const postId = request.params.id;
        console.log('Middleware: GET /api/posts/' + postId);
        // get the post from MongoDB
        Post.findOne({ _id: postId })
            .then((post) => {
                response.status(200).json({
                    message: 'Retrieved post successfully.',
                    post: post
                });
            });
    }
);


// middleware for the post creation
router.post('/',
    // use Multer to parse the image file (single file stored in the "image" field of the body)
    multer({ storage: multerConfig }).single("image"),

    // request handler creating the post
    (request, response, _next) => {
        console.log('Middleware: POST /api/posts');
        console.log(request.body);

        // build image path
        const serverUrl = request.protocol + '://' + request.get('host');
        const imagePath = serverUrl + '/images/' + request.file.filename; // request.file is made available by Multer

        const post = new Post({
            title: request.body.title,
            content: request.body.content,
            imagePath: imagePath
        });

        // save in MongoDB in the current database in collection called "posts" (lower-case plurial name of the model)
        console.log('Creating post in MongoDB post :' + post);
        post.save()
            .then((createdPost) => {
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
    // use Multer to parse the image file (single file stored in the "image" field of the body)
    // If a new image is provided, then the "image" field is provided and Multer will read it
    // If no new image is provided, then the "imagePath" field is provided and we can keep it as-is
    multer({ storage: multerConfig }).single("image"),

    // request handler to edit the post
    (request, response, _next) => {
        const postId = request.params.id;
        console.log('Middleware: PUT /api/posts/' + postId);
        console.log(request.body);

        // build image path
        let imagePath;
        if (request.file) {
            // use the URL of the new file created on the server by Multer
            const serverUrl = request.protocol + '://' + request.get('host');
            imagePath = serverUrl + '/images/' + request.file.filename; // request.file is made available by Multer
        } else {
            // use the URL in the post
            imagePath = request.body.imagePath;
        }

        // update a post in MongoDB
        Post.findByIdAndUpdate({ _id: postId }, {
                title: request.body.title,
                content: request.body.content,
                imagePath: imagePath
            })
            .then((updatedPost) => {
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
            .then((_deletionResult) => {
                response.status(200).json({
                    message: 'Deleted post successfully.',
                    id: postId
                });
            });
    }
);

// export the router containing all routes handlers for /api/posts section
module.exports = router;