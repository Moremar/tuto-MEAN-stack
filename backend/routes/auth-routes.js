// External imports
const express = require('express');

// Internal imports
const AuthController = require("../controllers/auth");

/*
 * All REST API routes for the /api/auth section
 * This shows what endpoints are supported.
 * The actual middleware logic is delegated to the auth controller.
 */

const router = express.Router();

// Routes accessed by the GUI
router.post('/signup', AuthController.signupUser);
router.post('/login', AuthController.loginUser);

// Debug routes only exposed via REST calls but not used by the GUI
router.delete('/delete', AuthController.deleteUser);
router.get('/users', AuthController.listUsers);

// export the router containing all routes handlers for /api/auth section
module.exports = router;