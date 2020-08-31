// Libraries
const express = require('express'); // backend framework

// Middlewares
const verifyAuth = require('../middlewares/verify-auth');
const extractFile = require('../middlewares/extract-file');
const PostsController = require('../middlewares/posts');


/*
 * All REST API routes for the /api/posts section
 *
 * We create a "router" and define all the routes, then in app.js we add this router as a middleware.
 * The "/api/posts/" prefix is given in app.js when registering the router, so it does not need
 * to be provided again in each route in this file
 */

const router = express.Router();


// middleware to get all posts (no authentication required)
router.get('/', PostsController.getPosts);

// middleware to get a single post (no authentication required)
router.get('/:id', PostsController.getPost);

// middleware for the post creation (authentication required)
router.post('/', verifyAuth,
    // use Multer to parse the image file (single file stored in the "image" field of the body)
    extractFile,
    PostsController.createPost);

// middleware to edit a post (authentication required)
router.put('/:id', verifyAuth,
    // use Multer to parse the image file (single file stored in the "image" field of the body)
    // If a new image is provided, then the "image" field is provided and Multer will read it
    // If no new image is provided, then the "imagePath" field is provided and we can keep it as-is
    extractFile,
    PostsController.editPost);

// middleware to delete a post (authentication required)
router.delete('/:id', verifyAuth, PostsController.deletePost);

// export the router containing all routes handlers for /api/posts section
module.exports = router;