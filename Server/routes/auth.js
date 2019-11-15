const express = require("express");
const router = express.Router();
const { signup, signin, signupFaculty } = require("../handlers/auth");
const { loginRequired, ensureCorrectUser } = require("../middlewares/auth");

/**
 * Route for signing up.
 * role can be either faculty or student.
 */
router.post("/signup/:role", signup);

/**
 * Route for signing up faculty.
 * It can be accessed only by an authenticated faculty
 */
router.post("/signup/faculty/:facultyId", loginRequired, ensureCorrectUser, signupFaculty);

/**
 * Route for signing in.
 * role can be either faculty or student.
 */
router.post("/signin/:role", signin);

module.exports = router;