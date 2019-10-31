const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser, ensureCorrectCourse } = require("../middlewares/auth");
const { registerStudent, registerAllStudent } = require("../handlers/register");

router.post("/:facultyId/:courseId/:rollNo", loginRequired, ensureCorrectUser, ensureCorrectCourse, registerStudent);
router.post("/:facultyId/:courseId/", loginRequired, ensureCorrectUser, ensureCorrectCourse, registerAllStudent);

module.exports = router;