const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser, ensureCorrectCourse, ensureFaculty } = require("../middlewares/auth");
const { markAttendance, getAttendanceEnh, getAttendanceAllEnh } = require("../handlers/service");

/**
 *  Route to mark attendance of a single student.
 */
router.post("/:facultyId/:courseId/:rollNo", loginRequired, ensureCorrectUser, ensureFaculty, ensureCorrectCourse, markAttendance);

/**
 *  Route to mark attendance of multiple students.
 */
// router.post("/:facultyId/:courseId/", loginRequired, ensureCorrectUser, ensureFaculty, ensureCorrectCourse, markAttendanceAll);

/**
 * Route to get attendance of a single student
 */
router.get("/:facultyId/:courseId/:rollNo", loginRequired, ensureCorrectUser, ensureFaculty, ensureCorrectCourse, getAttendanceEnh);

/**
 * Route to get attendance of multiple students.
 */
router.get("/:facultyId/:courseId/", loginRequired, ensureCorrectUser, ensureFaculty, ensureCorrectCourse, getAttendanceAllEnh);

module.exports = router;