// external imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// internal imports
const User = require('../models/user'); // Mongoose model for MongoDB User collection


/*
 * This controller groups all custom middlewares used for auth related endpoints
 * These middleware are called from the auth routes files (auth-routes.js)
 * We could instead define directly these functions in the routes file, but moving
 * them to a dedicated controller file makes the routes file easier to read
 *
 * Notes :
 *  - All error messages are very explicit to make testing easier.
 *    In a real app we should stick to "Invalid credentials" to not give hints on the
 *    existence or not of a user with a given email.
 *  - Only the hash should be stored, not the password.
 *    For now we store the password and return it in the "user" object of the API for easy testing
 *    The GUI does not use it and it should be removed once stable
 */

exports.signupUser = (request, response, _next) => {
    console.log('Middleware: POST ' + request.originalUrl);
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;
    console.log('Create user ' + email + "/" + password);

    if (email === undefined || password == undefined) {
        return response.status(400).json({
            message: 'ERROR - Email and password needed',
            user: null
        });
    }

    const salt = +process.env.BCRYPT_SALT; // stored as a string in the env variables
    bcrypt.hash(password, salt).then(
        (hash) => {
            // check no other user with this email
            User.findOne({ email: email }).then(
                (existingUser) => {
                    if (existingUser) {
                        const errorMess = 'ERROR - There is already an account with email ' + email;
                        console.log(errorMess)
                        response.status(400).json({
                            message: errorMess,
                            user: null
                        });
                        return;
                    }
                    // the account does not exist, create it
                    const newUser = new User({
                        username: username,
                        email: email,
                        password: password, // TODO remove
                        hash: hash
                    });
                    newUser.save().then(
                        (createdUser) => {
                            response.status(201).json({
                                message: "Signup OK",
                                user: {
                                    // do not send password and hash
                                    _id: createdUser._id,
                                    username: createdUser.username,
                                    email: createdUser.email,
                                    password: createdUser.password // TODO remove
                                }
                            });
                        }
                    );
                }
            );
        }
    );
};


exports.loginUser = (request, response, _next) => {
    console.log('Middleware: GET ' + request.originalUrl);
    const email = request.body.email;
    const password = request.body.password;
    console.log('Login with user ' + email + '/' + password);

    if (email === undefined || password == undefined) {
        return response.status(400).json({
            message: 'ERROR - Email and password needed',
            user: null
        });
    }

    // get the user from MongoDB
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                // no user found with the specified email
                return response.status(400).json({
                    message: 'ERROR - No user with email ' + email,
                    user: null
                });
            }
            bcrypt.compare(password, user.hash)
                .then((bcryptValid) => {
                    if (bcryptValid) {
                        // generate a Web Token
                        const jwtToken = jwt.sign(
                            // object to include in the token
                            { userId: user._id, username: user.username, email: user.email },
                            // key for the JWT encryption
                            process.env.JWT_ENCRYPTION_KEY,
                            // token options
                            { expiresIn: "1h" }
                        );
                        return response.status(200).json({
                            message: 'Login user successfully.',
                            token: jwtToken,
                            expiresIn: 3600 * 1000, // number of ms before token expiration
                            user: {
                                // do not send password and hash
                                _id: user._id,
                                username: user.username,
                                email: user.email,
                                password: user.password // TODO remove
                            },
                        });
                    } else {
                        return response.status(401).json({
                            message: 'Invalid password',
                            user: null
                        });
                    }
                });
        })
        .catch((errorData) => {
            console.log(errorData);
            return response.status(500).json({
                message: 'A server error occured',
                user: null
            });
        });
}


exports.deleteUser = (request, response, _next) => {
    console.log('Middleware: DELETE ' + request.originalUrl);
    const email = request.body.email;
    const password = request.body.password;
    console.log('Delete user ' + email + "/" + password);

    if (email === undefined || password == undefined) {
        return response.status(400).json({
            message: 'ERROR - Email and password needed',
            user: null
        });
    }

    User.findOne({ email: email }).then(
        (existingUser) => {
            if (!existingUser) {
                const errorMess = 'ERROR - No user with email ' + email;
                console.log(errorMess);
                return response.status(401).json({
                    message: errorMess,
                    user: null
                });
            }
            bcrypt.compare(password, existingUser.hash)
                .then((hashMatches) => {
                    if (!hashMatches) {
                        const errorMess = 'ERROR - Invalid password';
                        console.log(errorMess);
                        return response.status(401).json({
                            message: errorMess,
                            user: null
                        });
                    }
                    User.deleteOne({ email: email }).then(
                        (user) => {
                            console.log("deleted User : ");
                            console.log(user);
                            response.status(200).json({
                                message: 'Deleted user ' + email + ' successfully.',
                                user: existingUser
                            });
                        }
                    );
                });
        }
    );
}


exports.listUsers = (request, response, _next) => {
    User.find().then(
        (users) => {
            console.log('Middleware: GET ' + request.originalUrl);
            response.status(200).json({
                message: "Get users successfully",
                users: users
            });
        }
    );
}
