const jwt = require('jsonwebtoken');

/**
 * Middleware to check the validity of the JSON web token attached to the request
 *
 * A middleware is just a JS file that exports a function to apply
 * to the incoming request
 */

// TODO duplicate of constant in auth-routes.js, need to factorize
const SECRET_JWT_ENCRYPTION_KEY = "very_long_string_JWT_uses_for_encrypting_tokens";


module.exports = (request, result, next) => {
    try {
        // look for the JWT token in the "Authorization" header of the request
        // This header has the form "Bearer XXX" so we only want the XXX part
        const token = request.headers.authorization.split(" ")[1];

        // ensure it is not altered (throw if error)
        jwt.verify(token, SECRET_JWT_ENCRYPTION_KEY);
        console.debug("DEBUG - Decoded token : ");
        console.debug(jwt.decode(token));

        // token is valid, continue to the next middleware
        next();

    } catch (error) {
        return result.status(401).json({
            message: "Invalid or missing authentication token in the query header."
        });
    }
};