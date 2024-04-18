// Route for user login
// routes/auth.js

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/auth");
const { handleRegister, handleLogin } = require("../controllers/user");

// Import the User model for database operations
const User = require("../models/user");

// Route for user login
router.post("/login", handleLogin);

// Route for user registration
router.post("/register", handleRegister);



module.exports = router;
