const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser, ensureFaculty } = require("../middlewares/auth");
const { createCourse, changeCriteria, getCourses } = require("../handlers/course");

/**
 * Route to create a new course
 */
router.post("/:facultyId", loginRequired, ensureCorrectUser, ensureFaculty, createCourse);

/**
 * Route to change the attendance criteria for a course having courseId
 */
router.put("/:facultyId/:courseId", loginRequired, ensureCorrectUser, ensureFaculty, changeCriteria);

/**
 * Route to fetch all the courses taught by a faculty
 */
router.get("/:facultyId", loginRequired, ensureCorrectUser, ensureFaculty, getCourses);

module.exports = router;