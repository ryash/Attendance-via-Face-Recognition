const express = require("express");
const router = express.Router();
const { signup, signin } = require("../handlers/auth");

/**
 * Route for signing up.
 * role can be either faculty or student.
 */
router.post("/signup/:role", signup);

/**
 * Route for signing in.
 * role can be either faculty or student.
 */
router.post("/signin/:role", signin);

module.exports = router;