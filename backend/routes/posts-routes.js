// External imports
const express = require('express'); // backend framework
const multer = require('multer'); // file upload

// Internal imports
const verifyAuth = require('../middlewares/verify-auth');
const PostsController = require('../middlewares/posts');


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


// middleware to get all posts (no authentication required)
router.get('/', PostsController.getPosts);

// middleware to get a single post (no authentication required)
router.get('/:id', PostsController.getPost);

// middleware for the post creation (authentication required)
router.post('/', verifyAuth,
    // use Multer to parse the image file (single file stored in the "image" field of the body)
    multer({ storage: multerConfig }).single("image"),
    PostsController.createPost);

// middleware to edit a post (authentication required)
router.put('/:id', verifyAuth,
    // use Multer to parse the image file (single file stored in the "image" field of the body)
    // If a new image is provided, then the "image" field is provided and Multer will read it
    // If no new image is provided, then the "imagePath" field is provided and we can keep it as-is
    multer({ storage: multerConfig }).single("image"),
    PostsController.editPost);

// middleware to delete a post (authentication required)
router.delete('/:id', verifyAuth, PostsController.deletePost);

// export the router containing all routes handlers for /api/posts section
module.exports = router;