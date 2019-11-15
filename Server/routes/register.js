const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser, ensureCorrectCourse, ensureFaculty } = require("../middlewares/auth");
const { registerAllStudent, deRegisterStudent } = require("../handlers/register");

/**
 * Route to unregister a student from a course
 */
router.delete("/:facultyId/:courseId/:rollNo", loginRequired, ensureCorrectUser, ensureFaculty, ensureCorrectCourse, deRegisterStudent);

/**
 *  Route to register multiple students in a course
 */
router.post("/:facultyId/:courseId/", loginRequired, ensureCorrectUser, ensureFaculty, ensureCorrectCourse, registerAllStudent);

module.exports = router;