const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BCRYPT_SALT = 10;
const SECRET_JWT_ENCRYPTION_KEY = "very_long_string_JWT_uses_for_encrypting_tokens";

// Mongoose models for MongoDB collections
const User = require('../models/user');

/*
 * All REST API routes for the /api/auth section (login / signup)
 *
 * Note : All error messages are very explicit to make testing easier.
 * In a real app we should stick to "Invalid credentials" to not give hints on the
 * existence or not of a user with a given email.
 */

const router = express.Router();

// TODO simplify the nested callback by returning promises and handling them in a "then()" at top level

// middleware to signup (create a new user)
router.post('/signup',
    (request, response, _next) => {
        console.log('Middleware: POST ' + request.originalUrl);
        const email = request.body.email;
        const password = request.body.password;
        console.log('Create user ' + email + "/" + password);

        if (email === undefined || password == undefined) {
            return response.status(400).json({
                message: 'ERROR - Email and password needed',
                user: null
            });
        }

        bcrypt.hash(password, BCRYPT_SALT).then(
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
                            email: email,
                            password: password,
                            hash: hash
                        });
                        newUser.save().then(
                            (createdUser) => {
                                response.status(201).json({
                                    message: "Signup OK",
                                    user: createdUser
                                });
                            }
                        );
                    }
                );
            }
        );

    }
);


// middleware to delete a user
router.delete('/delete',
    (request, response, _next) => {
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
);


// middleware to login with an existing user
router.post('/login',
    (request, response, _next) => {
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
                            const jwtToken = jwt.sign({ email: user.email, id: user._id },
                                SECRET_JWT_ENCRYPTION_KEY, { expiresIn: "1h" }
                            );
                            return response.status(200).json({
                                message: 'Login user successfully.',
                                user: user, // only for debug, should not be in final code
                                token: jwtToken,
                                expiresIn: 3600 // number od seconds before token expiration
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
                    message: 'ERROR - TO CHECK',
                    user: null
                });
            });
    }
);

// middleware to list all users
// not used by the front-end, just an easy debug tool
router.get('/users',
    (request, response, _next) => {
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
);


// export the router containing all routes handlers for /api/auth section
module.exports = router;