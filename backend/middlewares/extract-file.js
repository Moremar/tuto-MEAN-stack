// Libraries
const multer = require('multer'); // file upload package


/*
 * Middleware using Multer to extract a file from the request
 * Every route that needs to extract a file from the request must call this middleware to
 * extract the file to "request.file", which the next middlewares can use.
 */

const MIME_TYPE_MAP = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
};

/*
 * Multer configuration for file upload
 */

const multerConfig = multer.diskStorage({
    destination: (_request, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        error = null;
        if (!isValid) {
            // should never happen if the backend validated correctly
            error = new Error('Invalid MIME type');
        }
        folder = 'images'; // relative to server root, which is inside /backend
        callback(error, folder);
    },
    filename: (_request, file, callback) => {
        const errors = null;
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(errors, name + '-' + Date.now() + extension);
    }
});

// Read the file to extract from the "image" property of the request body
module.exports = multer({ storage: multerConfig }).single("image");
