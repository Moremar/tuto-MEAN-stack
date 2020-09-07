const jwt = require('jsonwebtoken');

/**
 * Middleware to check the validity of the JSON web token attached to the request
 * If the token is valid, it attaches the user info to the request
 * This info will be used to ensure the user only deletes his own posts for ex
 * It is better than taking the user from the HTTP request because it can not be altered
 *
 * A middleware is just a JS file that exports a function to apply
 * to the incoming request
 */


module.exports = (request, result, next) => {
    try {
        // look for the JWT token in the "Authorization" header of the request
        // This header has the form "Bearer XXX" so we only want the XXX part
        const token = request.headers.authorization.split(" ")[1];

        // ensure it is not altered (throws if error)
        const decodedToken = jwt.verify(token, process.env.JWT_ENCRYPTION_KEY);

        // enrich the request with the auth info
        request.auth = decodedToken;

        // token is valid, continue to the next middleware
        next();

    } catch (error) {
        return result.status(401).json({
            message: "Invalid or missing authentication token in the query header."
        });
    }
};